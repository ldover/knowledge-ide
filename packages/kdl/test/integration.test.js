import {compile} from '../src/index.js';
import {parse} from "../src/index.js";
import {VFile} from "vfile";

function compileVFile(ast) {
  return compile([createVFile('./test.kdl', ast)])[0].data.compiled;
}


function createVFile(path, ast) {
  const file = new VFile({
    path: path,
    value: '',
  })

  file.data.parsed = ast;

  return file;
}
describe('KDL renders to MDAST properly', () => {
  it('Testing with a simple file', () => {
    const kdl0 = `symbol A as Action

statement 1 := ({A} in the limit converges towards Quality)

proof §1 {
  statement 1.1 := (proof statement 1)
  statement 1.2 := (proof statement 2)
}
`

    let actual = parse(kdl0);
    const out = compileVFile(actual);

    const mdast = out.render();
  })
})
