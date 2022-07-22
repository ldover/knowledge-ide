const {compile,} = require('../src/compiler/core');
const {parseFile} = require("../src");

describe('KDL renders to MDAST properly', () => {
  it('Testing with a simple file', () => {
    let actual = parseFile('./test/cases/Action.kdl')
    const out = compile(actual);

    const mdast = out.render();
  })
})