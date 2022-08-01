import {parse} from '../src';

describe('Parses symbol', () => {
  it('Works with one line', () => {
    const kdl0 = `symbol A as Action
    `
    const out = {
      type: "root",
      children: [
        {
          type: 'symbol',
          name: 'A',
          longName: 'Action'
        },
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });

  it('Works without abbreviation', () => {
    const kdl0 = `symbol A
    `
    const out = {
      type: "root",
      children: [
        {
          type: 'symbol',
          name: 'A',
          longName: null
        },
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });

  it('Works with two symbol definitions', () => {
    const kdl0 = `symbol A as Action
symbol S as Symbol
    `
    const out = {
      type: "root",
      children: [
        {
          type: 'symbol',
          longName: 'Action',
          name: 'A'
        },
        {
          type: 'symbol',
          longName: 'Symbol',
          name: 'S'
        },
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });
})

describe('Parses statement', () => {
  it('Parses a plain statement', () => {
    const kdl0 = `statement 1 := Plain statement
    `
    const out = {
      type: "root",
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

    expect(parse(kdl0)).toMatchObject(out);
  });

  it('Parses statement with reference', () => {
    const kdl0 = `statement 1 := Plain statement {A}`
    const out = {
      type: "root",
      children: [
        {
          type: "statement",
          name: '1',
          value: [
            {
              type: 'text',
              value: 'Plain statement ',
            },
            {
              type: 'reference',
              value: 'A',
            }
          ]
        }
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });

  it('Parses statement with two references', () => {
    const kdl0 = `statement 2 := {B} relates to {A}`
    const out = {
      type: "root",
      children: [
        {
          type: "statement",
          name: '2',
          value: [
            {
              type: 'reference',
              value: 'B',
            },
            {
              type: 'text',
              value: ' relates to ',
            },
            {
              type: 'reference',
              value: 'A',
            }
          ]
        }
      ]
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
        longName: 'Action',
        name: 'A'
      },
      {
        type: 'symbol',
        longName: 'Quality',
        name: 'Q'
      },
      {
        type: "statement",
        name: '1',
        value: [
          {
            type: 'reference',
            value: 'A',
          },
          {
            type: 'text',
            value: ' in the limit converges towards ',
          },
          {
            type: 'reference',
            value: 'Q',
          }
        ]
      },
      {
        type: "statement",
        name: '2',
        value: [
          {
            type: 'reference',
            value: 'Q',
          },
          {
            type: 'text',
            value: ' mediates ',
          },
          {
            type: 'reference',
            value: 'A',
          }
        ]
      }
    ]
  }


  it('Parses two defs and and 2 top-level statements', () => {
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
    expect(actual).toMatchObject(out);
  });
})