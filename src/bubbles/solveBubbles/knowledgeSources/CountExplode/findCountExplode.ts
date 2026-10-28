import { Bubble } from "../../../Bubble";

export const findCountExplode = (node: Bubble): Bubble | undefined => 
  node.nested?.find(({use, links}) => {
    if (!("count" in use)) return false;
    if (!use.count || use.count < 2) return false;
    // должна быть хотя бы одна неопределённая связь
    if (!links?.find(link => !link.use)) return false; // <-- но может это и не нужно
    return true;
  });