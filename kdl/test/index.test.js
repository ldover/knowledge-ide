import {parse} from '../src';
import {computeAbsolutePath} from "../src/util.js";

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
              symbol: 'A',
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
              symbol: 'B',
            },
            {
              type: 'text',
              value: ' relates to ',
            },
            {
              type: 'reference',
              symbol: 'A',
            }
          ]
        }
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  });

  it('Parses statement with a statement reference', () => {
    const kdl0 = `statement 2 := If {B:2} then {A}`
    const out = {
      type: "root",
      children: [
        {
          type: "statement",
          name: '2',
          value: [
            {
              type: 'text',
              value: 'If ',
            },
            {
              type: 'reference',
              symbol: 'B',
              statement: '2',
            },
            {
              type: 'text',
              value: ' then ',
            },
            {
              type: 'reference',
              symbol: 'A',
            }
          ]
        }
      ]
    }

    expect(parse(kdl0)).toMatchObject(out);
  })
})


describe("Imports work", () => {
  it('Parses an import statement', () => {
    const kdl = `use X of "./X.kdl"`

    const out = {
      type: "root",
      children: [
        {
          type: 'import',
          value: 'X',
          url: './X.kdl'
        }
      ]
    }
    expect(parse(kdl)).toMatchObject(out);
  })

  it('Parses multiple import statements', () => {
    const kdl = `use X of "./X.kdl"
use A of './Action.kdl'
`

    const out = {
      type: "root",
      children: [
        {
          type: 'import',
          value: 'X',
          url: './X.kdl'
        },
        {
          type: 'import',
          value: 'A',
          url: './Action.kdl'
        }
      ]
    }
    expect(parse(kdl)).toMatchObject(out);
  })
})

describe('Compute absolute url from relative', () => {
  it('works with a simple case', () => {
    const res = computeAbsolutePath('~/X.kdl', './Y.kdl')
    expect(res).toEqual('~/Y.kdl')

  })

  it('fails when beyond bound', () => {
    const res = computeAbsolutePath('~/X.kdl', '../Y.kdl')
    expect(res).toBeNull()
  })

  it('works with a more complex cases', () => {
    const res = computeAbsolutePath('~/src/X.kdl', '../Y.kdl')
    const res2 = computeAbsolutePath('~/src/deep/deep2/X.kdl', '../../Y.kdl')
    expect(res).toEqual('~/Y.kdl')
    expect(res2).toEqual('~/src/Y.kdl')
  })

  it('works with a more complex case', () => {
    const res = computeAbsolutePath('~/src/X.kdl', '../Y.kdl')
    expect(res).toEqual('~/Y.kdl')
  })

  it('finds forward folder', () => {
    const res = computeAbsolutePath('~/X.kdl', './src/Y.kdl')
    expect(res).toEqual('~/src/Y.kdl')
  })

  it('finds deep forward folder', () => {
    const res = computeAbsolutePath('~/X.kdl', './src/deep2/Y.kdl')
    expect(res).toEqual('~/src/deep2/Y.kdl')
  })
})


// describe('Parser works for the entire KDL script', () => {
//   const out = {
//     type: "root",
//     children: [
//       {
//         type: 'symbol',
//         longName: 'Action',
//         name: 'A'
//       },
//       {
//         type: 'symbol',
//         longName: 'Quality',
//         name: 'Q'
//       },
//       {
//         type: "statement",
//         name: '1',
//         value: [
//           {
//             type: 'reference',
//             value: 'A',
//           },
//           {
//             type: 'text',
//             value: ' in the limit converges towards ',
//           },
//           {
//             type: 'reference',
//             value: 'Q',
//           }
//         ]
//       },
//       {
//         type: "statement",
//         name: '2',
//         value: [
//           {
//             type: 'reference',
//             value: 'Q',
//           },
//           {
//             type: 'text',
//             value: ' mediates ',
//           },
//           {
//             type: 'reference',
//             value: 'A',
//           }
//         ]
//       }
//     ]
//   }
//
//
//   it('Parses two defs and and 2 top-level statements', () => {
//     const kdl0 = `symbol A as Action
// symbol Q as Quality
//
// statement 1 := {A} in the limit converges towards {Q}
// statement 2 := {Q} mediates {A}
//
// proof 1 {
//   statement 1.1 := proof statement 1
//   statement 1.2 := proof statement 2
// }
// `
//
//     let actual = parse(kdl0);
//     expect(actual).toMatchObject(out);
//   });
// })
