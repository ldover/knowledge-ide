const {compile,
  Reference,
  Statement,
  Symbol,
  Text,
  Root
} = require('../src/compiler/core');

describe('Compiles a symbol', () => {
  it('Compiles a symbol with abbreviation', () => {
    const ast = {
      type: 'symbol',
      name: 'Action',
      abbreviation: 'A'
    }

    const out = compile(ast);

    expect(out).toBeInstanceOf(Symbol);
    expect(out.name).toEqual('Action');
    expect(out.abbreviation).toEqual('A');
  });

  it('Compiles a symbol without abbreviation', () => {
    const ast = {
      type: 'symbol',
      name: 'Action',
      abbreviation: null
    }

    const out = compile(ast);

    expect(out.name).toEqual('Action');
    expect(out.abbreviation).toBeNull();
  });
})

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


describe('Compiles root file', () => {
  it('Compiles a simple root', () => {
    const ast = {
      type: "root",
      children: [
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
              value: 'A'
            }
          ]
        },
      ]
    }


    const out = compile(ast);

    expect(out).toBeInstanceOf(Root);
    expect(out.children).toBeInstanceOf(Array);
    expect(out.children[0]).toBeInstanceOf(Statement);
  });

  it('Compiles a symbol without abbreviation', () => {
    const ast = {
      type: 'symbol',
      name: 'Action',
      abbreviation: null
    }

    const out = compile(ast);

    expect(out.name).toEqual('Action');
    expect(out.abbreviation).toBeNull();
  });
})
