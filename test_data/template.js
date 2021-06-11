const cssPrettify = require("../cssPrettify");

test("%description[line:0,escape]% (file: %@filename%)", () => {
  const actual = cssPrettify(
%input[fromCodeBlock,toArray,indent:2]%.join("\n"), "%@filename%");

  const expected =
%expected[fromCodeBlock,toArray,indent:4]%.join("\n");

  expect(actual).toEqual(expected);
});
