const {parse} = require('../src/index');

describe('Parses symbol', () => {
  it('Works with one line', () => {
    const kdl0 = `def Action as A
    `
    const out = {
      type: "root",
      children: [
        {
          type: 'symbol',
          name: 'Action',
          abbreviation: 'A'
        },
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });

  it('Works without abbreviation', () => {
    const kdl0 = `def Action
    `
    const out = {
      type: "root",
      children: [
        {
          type: 'symbol',
          name: 'Action',
          abbreviation: null
        },
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });

  it('Works with two symbol definitions', () => {
    const kdl0 = `def Action as A
def Symbol as S
    `
    const out = {
      type: "root",
      children: [
        {
          type: 'symbol',
          name: 'Action',
          abbreviation: 'A'
        },
        {
          type: 'symbol',
          name: 'Symbol',
          abbreviation: 'S'
        },
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });

  it('Handles blank lines, whitespace and spaces', () => {
    const kdl0 = `   
    def   Action  as  A 

        def Symbol as S
    `
    const out = {
      type: "root",
      children: [
        {
          type: 'symbol',
          name: 'Action',
          abbreviation: 'A'
        },
        {
          type: 'symbol',
          name: 'Symbol',
          abbreviation: 'S'
        },
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  })
})


test('adds 1 + 2 to equal 3', () => {
  const kdl0 = `def Action as A

1: {A} is universal unfolding
`

  const out = {
    type: "root",
    children: [
      {
        type: 'symbol',
        name: 'Action',
        abbreviation: 'A'
      },
      {
        type: 'statement',
        name: '1',
        value: [
          {
            type: 'reference',
            value: 'A'
          },
          {
            type: 'text',
            value: ' is universal unfolding'
          }
        ],
        children: []
      }
    ]
  }

  expect(parse(kdl0)).toMatchObject(out);
});