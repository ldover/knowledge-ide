const {compile,
  Reference,
  Statement,
  Symbol,
  Text
} = require('../src/compiler/core');

describe('Compiles a statement', () => {
  it('Compiles one plain statement without children', () => {
    const ast = {
      type: 'statement',
      name: '1',
      value: [
        {
          type: 'text',
          value: 'Plain statement'
        }
      ]
    }

    const out = compile(ast);

    expect(out).toBeInstanceOf(Statement);
    expect(out.name).toEqual('1');
    expect(out.value).toBeInstanceOf(Array);
    expect(out.value.length).toEqual(1);
    expect(out.value[0]).toBeInstanceOf(Text);
    expect(out.value[0].value).toEqual('Plain statement');
  });

  it('Compiles one plain statement with children', () => {
    const ast = {
      type: 'statement',
      name: '1',
      value: [
        {
          type: 'text',
          value: 'Plain statement'
        }
      ],
      children: [
        {
          type: 'statement',
          name: '1',
          nested: true,
          parentName: '1',
          value: [
            {
              type: 'text',
              value: 'Child statement'
            }
          ],
          children: []
        },
        {
          type: 'statement',
          name: '2',
          nested: true,
          parentName: '1',
          value: [
            {
              type: 'text',
              value: 'Child statement 2'
            }
          ],
          children: []
        }
      ]

    }

    const out = compile(ast);

    expect(out.children).toBeInstanceOf(Array);
    expect(out.children.length).toEqual(2);
    expect(out.children[0]).toBeInstanceOf(Statement);
  });

  it('Compiles one compound statement', () => {
    const ast = {
      type: 'statement',
      name: '1',
      value: [
        {
          type: 'text',
          value: 'Plain statement '
        },
        {
          type: 'reference',
          value: 'A'
        }
      ]
    }

    const out = compile(ast);

    expect(out.value.length).toEqual(2);
    expect(out.value[0]).toBeInstanceOf(Text);
    expect(out.value[0].value).toEqual('Plain statement ');
    expect(out.value[1]).toBeInstanceOf(Reference);
    expect(out.value[1].name).toEqual('A');
  });
})
