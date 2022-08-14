import {
  compile,
  Reference,
  Statement,
  Symbol,
  Text,
  Root,
  Proof, MathExpression,
} from '../src/compiler/core.js'
import {VFile} from "vfile";

// Wrapper
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


describe('Compiles a symbol', () => {
  it('Compiles a symbol with long name specifier', () => {
    const compiledRoot = compileVFile({
      type: 'root',
      children: [
        {
          type: 'symbol',
          name: 'A',
          longName: 'Action'
        }
      ]
    })

    expect(compiledRoot).toBeInstanceOf(Root);
    let symbol = compiledRoot.symbol;
    expect(compiledRoot).toBeInstanceOf(Root);
    expect(symbol).toBeInstanceOf(Symbol);
    expect(symbol.name).toEqual('A');
    expect(symbol.longName).toEqual('Action');

    expect(compiledRoot.symbol).toBe(symbol);
  });

  it('Compiles a symbol without a long name specifier', () => {
    const ast = {
      type: 'root',
      children: [{
        type: 'symbol',
        name: 'A',
        longName: null
      }]
    }

    const out = compileVFile(ast);

    expect(out.symbol.name).toEqual('A');
    expect(out.symbol.longName).toBeNull();
  });

  it('Throws an error with multiple defined symbols', () => {
    const ast = {
      type: 'root',
      children: [
        {
          type: 'symbol',
          name: 'A',
          longName: null
        },
        {
          type: 'symbol',
          name: 'B',
          longName: null
        }
      ]
    }

    expect(() => {
      compileVFile(ast);
    }).toThrow()
  })
})

describe('Compiles a statement', () => {
  it('Compiles one plain statement without children', () => {
    const ast = {
      type: 'root',
      children: [

        {
          type: "statement",
          name: '1',
          value: [
            {
              type: 'text',
              value: 'Plain statement',
            }
          ]
        }
      ]
    }


    const out = compileVFile(ast);
    const statement = out.statements[0];

    expect(statement).toBeInstanceOf(Statement);
    expect(statement.name).toEqual('1');
    expect(statement.value).toBeInstanceOf(Array);
    expect(statement.value.length).toEqual(1);
    expect(statement.value[0]).toBeInstanceOf(Text);
    expect(statement.value[0].value).toEqual('Plain statement');
  });

  it('Compiles one compound statement', () => {
    const ast = {
      type: 'root',
      children: [
        {
          type: 'symbol',
          name: 'A',
          longName: null
        },
        {
          type: 'statement',
          name: '1',
          value: [
            {
              type: 'text',
              value: 'Plain statement '
            },
            {
              type: 'reference',
              symbol: 'A'
            }
          ]
        }
      ]
    }
    const out = compileVFile(ast).statements[0];

    expect(out.value.length).toEqual(2);
    expect(out.value[0]).toBeInstanceOf(Text);
    expect(out.value[0].value).toEqual('Plain statement ');
    expect(out.value[1]).toBeInstanceOf(Reference);
    expect(out.value[1].symbol).toEqual('A');
  });

  it('Compiles a statement with math expression', () => {
    const ast = {
      type: 'root',
      children: [
        {
          type: 'statement',
          name: '1',
          value: [
            {
              type: 'math',
              value: 'f(x) = y'
            },
          ]
        }
      ]
    }
    const out = compileVFile(ast).statements[0];

    expect(out.value[0]).toBeInstanceOf(MathExpression);
  })
})

describe('Compiles a proof', () => {
  const ast = {
    type: "root",
    children: [
      {
        type: "statement",
        name: '1',
        value: [
          {
            type: 'text',
            value: 'state something',
          },
        ]
      },
      {
        type: 'proof',
        statementReference: '1',
        statements: [
          {
            type: "statement",
            name: '1.1',
            value: [
              {
                type: 'text',
                value: 'state something',
              },
            ]
          }
        ]
      }
    ]
  }

  it('Compiles a simple proof', () => {
    const out = compileVFile(ast)
    const proof = out.proofs[0];

    expect(proof).toBeInstanceOf(Proof)
    expect(proof.statement).toBe(out.statements[0])
    expect(proof.statements.length).toEqual(1);
    expect(proof.statements[0]).toBeInstanceOf(Statement);
  })

  it('Renders a simple proof', () => {
    const out = compileVFile(ast)
    const proof = out.proofs[0];
    const mdast = proof.render();

    expect(mdast).toBeTruthy()
  })
})

describe('Compiles multiple KDL files', () => {
  it('Compiles two KDL files w/ imports', () => {
    const fileY = createVFile('./Y.kdl', {
        type: 'root',
        children: [
          {
            type: 'symbol',
            name: 'Y'
          },
          {
            type: "statement",
            name: '1',
            value: [
              {
                type: 'text',
                value: 'Plain statement',
              }
            ]
          }
        ]
      }
    )

    const fileX = createVFile('./X.kdl', {
        type: 'root',
        children: [
          {
            type: 'import',
            value: 'Y',
            url: './Y.kdl'
          },
          {
            type: 'symbol',
            name: 'X'
          },
          {
            type: "statement",
            name: '1',
            value: [
              {
                type: 'text',
                value: 'State ',
              },
              {
                type: 'reference',
                symbol: 'X'
              },
              {
                type: 'text',
                value: ' in relation to ',
              },
              {
                type: 'reference',
                symbol: 'Y'
              },
            ]
          }
        ]
      }
    )

    const out = compile([fileX, fileY]);
    const rootX = out[0].data.compiled;
    expect(rootX.refs.has('Y')).toBeTruthy();
    expect(rootX.refs.has('X')).toBeTruthy();
    expect(rootX.refs.get('Y')).toEqual('./Y.kdl');
  });
})
