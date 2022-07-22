const {parse} = require('../src/index');
const {parseFile} = require("../src");

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

describe('Parses statement', () => {
  it('Parses a plain statement', () => {
    const kdl0 = `1: Plain statement
    `
    const out = {
      type: "root",
      children: [
        {
          type: "statements",
          children: [
            {
              type: 'statement',
              name: '1',
              value: [
                {
                  type: 'text',
                  value: 'Plain statement'
                }
              ]
            }
          ]
        }
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });

  it('Parses statement with reference', () => {
    const kdl0 = `1: Plain statement {A}`
    const out = {
      type: "root",
      children: [
        {
          type: 'statements',
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
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });

  it('Parses statement with two references', () => {
    const kdl0 = `1: {B} relates to {A}`
    const out = {
      type: "root",
      children: [
        {
          type: 'statements',
          children: [
            {
              type: 'statement',
              name: '1',
              value: [
                {
                  type: 'reference',
                  value: 'B'
                },
                {
                  type: 'text',
                  value: ' relates to '
                },
                {
                  type: 'reference',
                  value: 'A'
                }
              ]
            }
          ]
        }
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });
})


describe('Parses nested statement', () => {
  it('Parses one level deep, one statement broad', () => {
    const kdl0 = `1: Plain statement
1.1: Child statement
    `
    const out = {
      type: "root",
      children: [
        {
          type: "statements",
          children: [
            {
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
                  value: [
                    {
                      type: 'text',
                      value: 'Child statement'
                    }
                  ],
                }
              ]
            }
          ]
        }]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });
})

describe('Parser works for the entire KDL script', () => {
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
        name: 'Quality',
        abbreviation: 'Q'
      },
      {
        type: 'statements',
        children: [
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
                value: ' in the limit converges towards '
              },
              {
                type: 'reference',
                value: 'Q'
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
          },
          {
            type: 'statement',
            name: '2',
            value: [
              {
                type: 'reference',
                value: 'Q'
              },
              {
                type: 'text',
                value: ' mediates '
              },
              {
                type: 'reference',
                value: 'A'
              }
            ],
            children: [
              {
                type: 'statement',
                name: '1',
                nested: true,
                parentName: '2',
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
                parentName: '2',
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
        ]
      }
    ]
  }


  it('Parses two defs and and 2 top-level statements', () => {
    const kdl0 = `def Action as A
def Quality as Q

1: {A} in the limit converges towards {Q}
  1.1: Child statement
  1.2: Child statement 2
2: {Q} mediates {A}
  2.1: Child statement
  2.2: Child statement 2
    `

    let actual = parse(kdl0);
    expect(actual).toMatchObject(out);
  });

  it('Parser from file', () => {
    let actual = parseFile('./test/cases/Action.kdl')
    expect(actual).toMatchObject(out);
  })
})