import { LinkDef, SrcTemplate } from "./SrcTemplate";

export const srcTemplatesList: SrcTemplate[] = [
  {
    code: "NH4", 
    pos: "any", 
    mirror: true,
    struct: { atoms: [{id: "N", H:4, valency: 5, charge: 1}]},
  },
  {
    code: "C6H5", 
    pos: "edge", 
    // зеркальное отображение для фенильной группы не принято. 
    struct: {
      atoms: [0,1,2,3,4,5].map(i => ({id: "C", H: i===0 ? 0 : 1, valency: 4})),
      links: [0,1,2,3,4,5].map(i => [i, (i+1) % 6, ((i+1) % 2)+1] satisfies LinkDef)
    }
  },

  // todo: надо как-то отличать нитрогруппу он нитрита
  // нитрогруппа может зеркалиться, например в синей книге:
  // O2N-COOH  - nitroformic acid 

  {
    code: "NO3",
    mirror: true,
    pos: "edge",
    struct: {
      // SMILES: [N+](=O)([O-])[O-] from PubChem https://pubchem.ncbi.nlm.nih.gov/compound/943
      atoms: [
        {id: "N", valency: 5, charge: +1}, // 0   
        {id: "O", valency: 2, charge: -1}, // 1   
        {id: "O", valency: 2},             // 2
        {id: "O", valency: 2},             // 3
      ],
    },
  },

  // Sulfate, Selenate, Tellurate
  {
    code: "?O4", 
    pos: "end", 
    cases: ["S", "Se", "Te"],
    struct: {
      atoms: [
        {id: "?", valency: 6}, 
        {id: "O", valency: 2, charge: -1}, 
        {id: "O", valency: 2, charge: -1},
        {id: "O", valency: 2}, 
        {id: "O", valency: 2},
      ],
      links: [[0,1,1], [0,2,1], [0,3,2], [0,4,2]],
    },
  },
  // Carbonate, Silicate, Sulfite, Selenite, Tellurite
  {
    code: "?O3", 
    pos: "end", 
    cases: ["S", "Se", "Te", "C", "Si"],
    struct: {
      atoms: [
        {id: "?", valency: 4}, 
        {id: "O", valency: 2, charge: -1}, 
        {id: "O", valency: 2, charge: -1},
        {id: "O", valency: 2}, 
      ],
      links: [[0,1,1], [0,2,1], [0,3,2]],
    },
  },
  // Phosphate, Arsenate, Antimonate 
  {
    code: "?O4",
    pos: "end",
    cases: ["P", "As", "Sb"],
    struct: {
      atoms: [
        {id: "?", valency: 5}, // 0   1 -O
        {id: "O", valency: 2}, // 1       \
        {id: "O", valency: 2}, // 2  2 -O--P==O 4
        {id: "O", valency: 2}, // 3       /0
        {id: "O", valency: 2}, // 4   3 -O
      ],
      links: [[0,1,1], [0,2,1], [0,3,1], [0,4,2]],
    },
  },
];