import {compile} from  '../src/compiler/core';
import {parse} from  "../src";

describe('KDL renders to MDAST properly', () => {
  it('Testing with a simple file', () => {
    let actual = parse(`def Action as A
def Quality as Q

1: {A} in the limit converges towards {Q}
  1.1: Child statement
  1.2: Child statement 2
2: {Q} mediates {A}
  2.1: Child statement
  2.2: Child statement 2`)
    const out = compile(actual);

    const mdast = out.render();
  })
})