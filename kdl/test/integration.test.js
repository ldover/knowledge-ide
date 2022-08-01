import {compile} from  '../src/compiler/core';
import {parse} from  "../src";

describe('KDL renders to MDAST properly', () => {
  it('Testing with a simple file', () => {
    const kdl0 = `symbol A as Action
symbol Q as Quality

statement 1 := {A} in the limit converges towards {Q}
statement 2 := {Q} mediates {A}
 
proof 1 {
  statement 1.1 := proof statement 1
  statement 1.2 := proof statement 2
} 
`

    let actual = parse(kdl0);
    const out = compile(actual);

    const mdast = out.render();
  })
})