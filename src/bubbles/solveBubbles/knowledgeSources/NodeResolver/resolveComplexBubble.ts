import { Bubble } from "../../../Bubble";
import { stringifyBubble } from "../../../bubblesBase/stringifyBubble";
import { isNestedSolved } from "../../solveUtils/isBubblesSolved";
import { isComplexNode } from "../../solveUtils/isComplexNode";
import { freeValency } from "../../valency/freeValency";
import { getValency } from "../../valency/getValency";
import { internalValency } from "../../valency/internalValency";

export type ComplexNodeRes = {
  main: Bubble;
  slave: Bubble;
  alt?: Bubble;
}

type ItemInfo = {
  it: Bubble;
  freeVal: number;
  n: number;
}

type ResolveCtx = {
  items: ItemInfo[];
  maxVal: number;
  minVal: number;
  maxNminVal: number;
}

const hasUndefinedLink = ({links}: Bubble): boolean => !!(links?.find(({use}) => !use));

type Rule = {
  name: string;
  test(ctx: ResolveCtx): ComplexNodeRes | undefined;
}

const isAloneMaxVal = (ctx: ResolveCtx, it: ItemInfo | undefined): it is ItemInfo =>
  it?.n === 1 && it.freeVal === ctx.maxVal;

const isMinVal = (ctx: ResolveCtx, it: ItemInfo | undefined): it is ItemInfo =>
  it?.freeVal === ctx.minVal;

const rules: Rule[] = [
  {
    name: "edgeLeft",
    test(ctx) {
      const [first, second] = ctx.items;
      if (isAloneMaxVal(ctx, first) && isMinVal(ctx, second)) {
        return {main: first.it, slave: second.it}
      }
      if (isMinVal(ctx, first) && isAloneMaxVal(ctx, second)) {
        return {main: second.it, slave: first.it}
      }
      return undefined;
    }
  },
  {
    name: "edgeRight",
    test(ctx) {
      const {items} = ctx;
      const first = items[items.length - 1];
      const second = items[items.length - 2];
      if (isAloneMaxVal(ctx, first) && isMinVal(ctx, second)) {
        return {main: first.it, slave: second.it}
      }
      if (isMinVal(ctx, first) && isAloneMaxVal(ctx, second)) {
        return {main: second.it, slave: first.it}
      }
      return undefined;
    }
  },
  {
    name: "acquisition",
    test(ctx) {
      // todo: пока что это не самая удачная реализация. ожидается улучшение в процессе TDD
      const i = ctx.items.findIndex(it => isAloneMaxVal(ctx, it));
      if (i < 0) return undefined;
      const mi = ctx.items[i]!;
      // элемент может присоединить соседа с валентностью более 1, если у него нет других соседей
      // например:
      // CH3-CH2-C~O~O~H  =>  CH3-CH2-C(=O)~O~H
      // тут углерод с freeVal=3 имеет только одного соседа - кислород с freeVal=2
      const nearCount = mi.it.links?.reduce((sum, {use}) => sum + (use ? 0 : 1), 0);
      if (nearCount !== 1) return undefined;

      const canAcquire = (it: ItemInfo | undefined): it is ItemInfo => {
        if (!it) return false;
        if (it.freeVal < 2) return false;
        if (it.n !== 1) return false;
        return true;
      }
      const left = ctx.items[i-1];
      if (canAcquire(left)) {
        return {main: mi.it, slave: left.it};
      }
      const right = ctx.items[i+1];
      if (canAcquire(right)) {
        return {main: mi.it, slave: right.it};
      }
      return undefined;
    },
  },
  {
    name: "doubleMin",
    test({items}: ResolveCtx) {
      const checkDir = (pos: number, dir: 1|-1): boolean => {
        const a = items[pos]; // главный элемент
        const b = items[pos+dir]; // ближний
        const c = items[pos+dir+dir]; // дальний
        if (!c || !b || !a) return false;
        if (a.n !== 1) return false;
        // свободная валентность ближнего и дальнего должны быть 1
        // главный элемент должен иметь достаточную св. валентность для присоединения ближнего
        if (c.freeVal !== 1 || b.freeVal !== 1 || a.freeVal < b.n + 1) return false;
        return true;
      }
      for (let pos=0; pos < items.length; pos++) {
        if (checkDir(pos, 1)) {
          return {main: items[pos]!.it, slave: items[pos+1]!.it}
        }
        if (checkDir(pos, -1)) {
          return {main: items[pos]!.it, slave: items[pos-1]!.it}
        }
      }
      return undefined;
    },
  },
  {
    name: "extraEdge",
    test({items}) {
      type Def = [number, number, number];
      const check = ([ai, bi, ci]: Def): boolean => {
        const a = items[ai];
        const b = items[bi];
        const c = items[ci];
        if (!a || !b || !c) return false;
        if (a.freeVal !== 1) return false;
        if (b.freeVal < 2 || b.n !== 1) return false;
        // if (c.freeVal*c.n >= b.freeVal) return false;
        if (c.freeVal !== 1) return false;
        return true;
      };
      const n = items.length;
      const recs: Def[] = [
        [0, 1, 2],
        [n-1, n-2, n-3],
      ];
      for (let rec of recs) {
        if (check(rec)) {
          const [s, m] = rec; 
          return {
            main: items[m]!.it,
            slave: items[s]!.it,
          }
        }
      }
      return undefined;
    }
  },
  {
    name: "attraction",
    test({items, maxNminVal}) {
      // важно, что это правило выполняется, когда уже остальные не дали результата.
      // нужно найти элемент с минимальной валентностью, но максимальным количеством.
      // если с одной стороны находится элемент с n=1 и валентностью больше чем количество центрального
      // а с другой стороны - элемент к которому присоединиться нельзя.
      const canJoin = (src: ItemInfo, dst: ItemInfo): boolean => {
        return dst.n === 1 && dst.freeVal > src.n;
      }
      for (let i=0; i<items.length; i++) {
        const medium = items[i]!;
        if (medium.freeVal !== 1 || medium.n !== maxNminVal) continue;
        const left = items[i-1];
        const right = items[i+1];
        if (!left || !right) continue;
        const okLeft = canJoin(medium, left);
        const okRight = canJoin(medium, right);
        if (okLeft && !okRight) return {main: left.it, slave: medium.it};
        if (!okLeft && okRight) return {main: right.it, slave: medium.it};
      }
      return undefined;
    },
  },
];

export const resolveComplexBubble = (bubble: Bubble, log?: (msg: string) => void): ComplexNodeRes | undefined => {
  if (!isComplexNode(bubble)) {
    log?.("is not complex node");
    return undefined;
  }
  if (isNestedSolved(bubble)) {
    log?.("already solved");
    return undefined;
  }
  const undefinedValencyIndex = bubble.nested?.findIndex((it) => !internalValency(it)) ?? -1;
  if (undefinedValencyIndex >= 0) {
    log?.(`undefined valency for ${undefinedValencyIndex} item`);
    return undefined;
  }
  const unresolvedBubbles = bubble.nested?.filter(hasUndefinedLink) ?? [];
  let maxVal = 0;
  let minVal = 1000;
  const items: ItemInfo[] = unresolvedBubbles.map(it => {
    const freeVal = freeValency(it);
    // если для любого элемента сложного узла нет внутренней валентности, то решения нет
    // скорее всего, ешё не отработал агент ValencyPredictor
    const n: number = ("count" in it.use && it.use.count) || 1;
    maxVal = Math.max(maxVal, freeVal);
    minVal = Math.min(minVal, freeVal);
    return {it, freeVal, n};
  });
  let maxNminVal = 0;
  items.forEach(({n, freeVal}) => {
    if (freeVal === minVal) {
      maxNminVal = Math.max(maxNminVal, n * freeVal);
    }
  })
  const ctx: ResolveCtx = { items, maxVal, minVal, maxNminVal };
  for (let rule of rules) {
    const res = rule.test(ctx);
    if (res) {
      log?.(`${rule.name}: ${stringifyBubble(res.main)} > ${stringifyBubble(res.slave)}`);
      return res;
    }
  }
  log?.("no solution found");
  return undefined;
}

export const resolveComplexBubbleOld = (bubble: Bubble, log?: (msg: string) => void): ComplexNodeRes | undefined => {
  if (!isComplexNode(bubble)) {
    log?.("is not complex node");
    return undefined;
  }
  if (isNestedSolved(bubble)) {
    log?.("bubble already solved");
    return undefined;
  }
  const {nested = []} = bubble;

  const items: Bubble[] = [];
  const freeVals: number[] = [];
  const freeValsN: number[] = [];
  let maxFreeValency = 0;
  for (let i=0; i<nested.length; i++) {
    const it = nested[i]!;
    const {int, free} = getValency(it);
    // если для любого элемента сложного узла нет внутренней валентности, то решения нет
    // скорее всего, ешё не отработал агент ValencyPredictor
    if (!int) {
      log?.(`undefined valency for ${i} item`);
      return undefined;
    }
    if (!free) {
      // если свободная валентность = 0, то этот пузырь решать уже не надо
      continue;
    }
    if (!("count" in it.use)) continue;
    const count = it.use.count ?? 1;
    maxFreeValency = Math.max(maxFreeValency, free);
    freeVals.push(free);
    freeValsN.push(free * count);
    items.push(it);
  }
  log?.(`max free valency = ${maxFreeValency}`);

  if (!maxFreeValency) {
    log?.("bubble already solved");
    return undefined;
  }

  // нужно выбрать тех, у кого есть сосед с минимальной свободной валентностью
  let indices: number[] = [];
  let minNearestVal = hugeValency;
  for (let i=0; i<items.length; i++) {
    const curFree = freeVals[i]!;
    if (curFree === maxFreeValency && curFree === freeValsN[i]) {
      indices.push(i);
      const leftFree = freeVals[i-1] ?? hugeValency;
      const rightFree = freeVals[i+1] ?? hugeValency;
      minNearestVal = Math.min(minNearestVal, leftFree, rightFree);
    }
  }
  log?.(`items with max free valency: ${indices.join(", ")}`);
  if (minNearestVal === hugeValency) {
    log?.(`no near items found`);
    return undefined;
  }

  indices = indices.filter(i => freeVals[i-1] === minNearestVal || freeVals[i+1] === minNearestVal);
  log?.(`min nearest free valency = ${minNearestVal}, items: ${indices.join(", ")}`);

  if (indices[0] === 0) {
    const [i] = indices;
    // приоритетный случай типа CH3...
    log?.("first selected");
    return {
      main: items[i]!,
      slave: items[i+1]!,
    }
  }
  const lastNdx = indices.length-1;
  if (indices[lastNdx] === items.length-1) {
    // зеркальный вариант. ...H3C  менее вероятный конечно
    const i = indices[lastNdx];
    log?.("last selected");
    return {
      main: items[i]!,
      slave: items[i-1]!,
    }
  }
  if (indices.length === 1) {
    const i = indices[0]!;
    const leftFreeVal = freeVals[i-1];
    const rightFreeVal = freeVals[i+1];
    if (leftFreeVal === minNearestVal && rightFreeVal !== minNearestVal) {
      log?.("single left");
      return {
        main: items[i]!,
        slave: items[i-1]!,
      }
    } 
    if (leftFreeVal !== minNearestVal && rightFreeVal === minNearestVal) {
      log?.("single right");
      return {
        main: items[i]!,
        slave: items[i+1]!,
      }
    } 
  }

  const getCount = (itemIndex: number): number => {
    const it = items[itemIndex];
    return (it && "count" in it.use) ? it.use.count ?? 0 : 0;
  }
  let maxCount = 0;
  indices.forEach(i => {
    maxCount = Math.max(maxCount, getCount(i-1), getCount(i+1));
  });
  log?.(`max near count: ${maxCount}`)
  indices = indices.filter(i => getCount(i-1) === maxCount || getCount(i+1) === maxCount);
  log?.(`items with max near count: ${indices.join(", ")}`);

  if (indices.length === 1) {
    const i = indices[0]!;
    if (getCount(i-1) === maxCount && getCount(i+1) < maxCount) {
      log?.(`left max count for ${i}`)
      return {
        main: items[i]!,
        slave: items[i-1]!,
      }
    } else if (getCount(i-1) < maxCount && getCount(i+1) == maxCount) {
      log?.(`right max count for ${i}`);
      return {
        main: items[i]!,
        slave: items[i+1]!,
      }
    }
  }

  // Если не обнаружено центра с одним подчинённым, можно искать предпочтительных подчинённых.
  // тех, у кого меньше internalValency
  type Tri = {
    iMain: number;
    iSlave: number;
    intVal: number;
  }
  let tres: Tri | undefined
  for (let i of indices) {
    const leftItem = items[i-1];
    const rightItem = items[i+1];
    if (leftItem && rightItem) {
      const leftIntVal = internalValency(leftItem);
      const rightIntVal = internalValency(rightItem);
      if (leftIntVal < rightIntVal) {
        if (!tres || leftIntVal < tres.intVal) {
          tres = {iMain: i, iSlave: i-1, intVal: leftIntVal}
        }
      } else if (rightIntVal < leftIntVal) {
        if (!tres || rightIntVal < tres.intVal) {
          tres = {iMain: i, iSlave: i+1, intVal: rightIntVal}
        }
      }
    }
  }
  if (tres) {
    log?.(`main ${tres.iMain} connect to ${tres.iSlave} by internal valency ${tres.intVal}`);
    return {
      main: items[tres.iMain]!,
      slave: items[tres.iSlave]!,
    }
  }

  if (indices.length === 0) return undefined;

  const pairIndices: [number, number][] = indices.map(i => {
    const left = freeVals[i-1];
    const right = freeVals[i+1];
    if (left === minNearestVal && right !== minNearestVal) {
      return [i, i-1] as [number, number];
    }
    if (right === minNearestVal && left !== minNearestVal) {
      return [i, i+1] as [number, number];
    }
    return undefined;
  }).filter(pair => !!pair);
  if (pairIndices.length > 0) {
    const [iMain, iSlave] = pairIndices[0]!;
    log?.(`main ${iMain} connect to ${iSlave}`);
    return {
      main: items[iMain]!,
      slave: items[iSlave]!,
    }
  }

  // ситуация, когда оба кандидата на присоединение не имеют преимущества. Выбирается левый. 
  // Но это может быть ошибкой. Поэтому перед этим сохраняется текущее состояние. 
  // И если решение заходит в тупик, то состояние восстанавливаетя, после чего выбирается правый.
  if (indices.length > 0) {
    const i = indices[0]!;
    const left = items[i-1];
    const right = items[i+1];
    if (left && right) {
      log?.(`for ${i} selected left with alt`);
      return {
        main: items[i]!,
        slave: left,
        alt: right,
      }
    }
  }
  return undefined;
}

const hugeValency = 1000;