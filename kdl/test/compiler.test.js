import {
  compile,
  Reference,
  Statement,
  Symbol,
  Text,
  Root,
} from '../src/compiler/core'
import {VFile} from "vfile";

function createVFile(path, ast) {
  const file = new VFile({
    path: path,
    value: '',
  })

  file.data.parsed = ast;

  return file;
}


describe('Compiles a symbol', () => {
  it('Compiles a symbol with long name specifier', () => {
    const file = createVFile('./test.kdl', {
      type: 'root',
      children: [
        {
          type: 'symbol',
          name: 'A',
          longName: 'Action'
        }
      ]
    })

    const vfile = compile([file])[0];
    expect(vfile).toBeInstanceOf(VFile);
    const compiledRoot = vfile.data.compiled

    expect(compiledRoot).toBeInstanceOf(Root);
    let symbol = compiledRoot.symbol;
    expect(compiledRoot).toBeInstanceOf(Root);
    expect(symbol).toBeInstanceOf(Symbol);
    expect(symbol.name).toEqual('A');
    expect(symbol.longName).toEqual('Action');

    expect(compiledRoot.children.length).toEqual(1);
    expect(compiledRoot.children[0]).toBe(symbol);
  });

  // it('Compiles a symbol without a long name specifier', () => {
  //   const ast = {
  //     type: 'symbol',
  //     name: 'A',
  //     longName: null
  //   }
  //
  //   const out = compile(ast);
  //
  //   expect(out.name).toEqual('A');
  //   expect(out.longName).toBeNull();
  // });
})
//
// describe('Compiles a statement', () => {
//   it('Compiles one plain statement without children', () => {
//     const ast = {
//       type: "statement",
//       name: '1',
//       value: [
//         {
//           type: 'text',
//           value: 'Plain statement',
//         }
//       ]
//     }
//
//
//     const out = compile(ast);
//
//     expect(out).toBeInstanceOf(Statement);
//     expect(out.name).toEqual('1');
//     expect(out.value).toBeInstanceOf(Array);
//     expect(out.value.length).toEqual(1);
//     expect(out.value[0]).toBeInstanceOf(Text);
//     expect(out.value[0].value).toEqual('Plain statement');
//   });
//
//   it('Compiles one compound statement', () => {
//     const ast = {
//       type: 'statement',
//       name: '1',
//       value: [
//         {
//           type: 'text',
//           value: 'Plain statement '
//         },
//         {
//           type: 'reference',
//           value: 'A'
//         }
//       ]
//     }
//
//     const out = compile(ast);
//
//     expect(out.value.length).toEqual(2);
//     expect(out.value[0]).toBeInstanceOf(Text);
//     expect(out.value[0].value).toEqual('Plain statement ');
//     expect(out.value[1]).toBeInstanceOf(Reference);
//     expect(out.value[1].name).toEqual('A');
//   });
// })
//
//
// describe('Compiles root file', () => {
//   it('Compiles a simple root', () => {
//     const ast = {
//       type: "root",
//       children: [
//         {
//           type: 'statement',
//           name: '1',
//           value: [
//             {
//               type: 'text',
//               value: 'Plain statement '
//             },
//             {
//               type: 'reference',
//               value: 'A'
//             }
//           ]
//         }
//       ]
//     }
//
//     const out = compile(ast);
//
//     expect(out).toBeInstanceOf(Root);
//     expect(out.children).toBeInstanceOf(Array);
//     expect(out.children[0]).toBeInstanceOf(Statement);
//   });
// })
