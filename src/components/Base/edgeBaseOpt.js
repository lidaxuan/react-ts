export function edgeBase(source, target) {
  let opt = {
    type: "edge",
    shape: "customEdge",
    start: {
      "x": 0,
      "y": 0 
    },
    end: {
      "x": 0,
      "y": 0
    },
  };
  opt.start.y = source / 2;
  opt.end.y = (target / 2) - target;
  return opt;
}
