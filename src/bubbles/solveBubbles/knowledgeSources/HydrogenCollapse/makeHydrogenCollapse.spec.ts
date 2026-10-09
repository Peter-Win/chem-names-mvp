import { createExampleForHCollapse } from "./createExampleForHCollapse"
import { makeHydrogenCollapse } from "./makeHydrogenCollapse";

test("makeHydrogenCollapse", () => {
  const {root, h, cl} = createExampleForHCollapse();
  expect(root.nested?.length).toBe(2);
  expect(cl.use.type).toBe("atom");
  if (cl.use.type === "atom") {
    expect(cl.use.H).toBeUndefined();
  }
  expect(cl.links?.length).toBe(1);

  makeHydrogenCollapse(h, cl);

  expect(root.nested?.length).toBe(1);
  expect(cl.use.type).toBe("atom");
  if (cl.use.type === "atom") {
    expect(cl.use.H).toBe(1);
  }
  expect(cl.links?.length ?? 0).toBe(0);
})