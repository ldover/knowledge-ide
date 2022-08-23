import {parse} from '../src/index.js';
import {compile, List, ListItem, Root} from "../src/compiler/index.js";
import {VFile} from "vfile";

// Wrapper
function compileVFile(ast) {
  return compile([createVFile('./test.kdl', ast)])[0].data.compiled;
}


function createVFile(path, value) {
  const file = new VFile({
    path,
    value,
  })

  return file;
}

describe('MdxExpression class works properly',  () => {
  const noteA = `# Note A`

  it ('Renders reference to another note ', () => {
    const noteB = `<script>
    import NoteA from './NoteA.mdl'
</script>
# Note B
Ref: {NoteA}
`
    const fileA = createVFile('./NoteA.mdl', noteA);
    const fileB = createVFile('./NoteB.mdl', noteB);

    parse([fileA, fileB])
    const out = compile([fileA, fileB])

    const rootB = fileB.data.compiled;
    const rendered = rootB.render();

    let p = rendered.children[1];
    expect(p.type).toEqual('paragraph');
    expect(p.children[1]).toMatchObject({
      type: 'link',
      title: 'Note A',
      url: './NoteA.mdl',
      children: [
        {type: 'text', value: 'Note A'}
      ]
    })
  })

  it ('Renders another note', () => {
    const noteB = `<script>
    import NoteA from './NoteA.mdl'
</script>
# Note B
{NoteA.render()}
`


    const fileA = createVFile('./NoteA.mdl', noteA);
    const fileB = createVFile('./NoteB.mdl', noteB);

    parse([fileA, fileB])
    const out = compile([fileA, fileB])
    console.log()

    const rootB = fileB.data.compiled;
    const rendered = rootB.render();

    expect(rendered.children[1].type).toEqual('root');
    expect(rendered.children[1].children[0].type).toEqual('heading');
    expect(rendered.children[1].children[0].depth).toEqual(1);
    expect(rendered.children[1].children[0].children[0].value).toEqual('Note A');
  })

  it ('Works with object parameter', () => {
    const noteA = `# Note A
Note A content`
    const noteB = `<script>
    import NoteA from './NoteA.mdl'
</script>
# Note B
{NoteA.render({heading: false})}
`

    const fileA = createVFile('./NoteA.mdl', noteA);
    const fileB = createVFile('./NoteB.mdl', noteB);

    parse([fileA, fileB])
    const out = compile([fileA, fileB])
    console.log()

    const rootB = fileB.data.compiled;
    const rendered = rootB.render();

    expect(rendered.children[1].type).toEqual('root');
    expect(rendered.children[1].children[0].type).toEqual('paragraph');
    expect(rendered.children[1].children[0].children[0].value).toEqual('Note A content');

  })

  it ('Parses MD ordered list', () => {
    const noteA = `1. item 1
2. item 2
`

    const fileA = createVFile('./NoteA.mdl', noteA);

    const out = parse([fileA])[0].data.parsed

    expect(out.children[0].type).toEqual('list');
    expect(out.children[0].ordered).toEqual(true);
  })

  it ('Compiles MD ordered list', () => {
    const noteA = `1. item 1
2. item 2
`
    let vFile = createVFile('./noteA.mdl', noteA);
    const parsed = parse([vFile])
    const parsedA = parsed[0].data.parsed;

    const fileA = compile([vFile])[0];
    const rootA = fileA.data.compiled;
    expect(rootA.children[0]).toBeInstanceOf(List);
    expect(rootA.children[0].ordered).toEqual(true)
  })

  it ('Renders ordered list', () => {
    const noteA = `1. item 1
2. item 2
`
    let vFile = createVFile('./noteA.mdl', noteA);
    const parsed = parse([vFile])
    const parsedA = parsed[0].data.parsed;

    const fileA = compile([vFile])[0];
    const rootA = fileA.data.compiled;
    const mdast = rootA.render();
    expect(mdast.children[0].type).toEqual('list');
    expect(mdast.children[0].ordered).toEqual(true)
  })

  // todo: find out how to configure micromark to parse 1 tab or 2 spaces (works with bullet list, but not ordered)
  it ('Parses ordered list with 2 spaces or 1 tab', () => {
    const noteA = `1. item 1
  1. item 1.1
  2. item 2.2
`
    /**
     * List
     *  ListItem - item 1
     *    List
     *      ListItem - item 1.1
     */

    let vFile = createVFile('./noteA.mdl', noteA);
    const parsed = parse([vFile])
    const parsedA = parsed[0].data.parsed;

    expect(parsedA.children[0]).toEqual('list');
    expect(parsedA.children[0].children[0].type).toEqual('listItem');
    expect(parsedA.children[0].children[0].children[1].type).toEqual('list');
  })


  it ('Works with literal parameter', () => {
    const noteB = `<script>
    import NoteA from './NoteA.mdl'
</script>
# Note B
{NoteA.ref('Custom Title')}
`

    const fileA = createVFile('./NoteA.mdl', noteA);
    const fileB = createVFile('./NoteB.mdl', noteB);

    parse([fileA, fileB])
    const out = compile([fileA, fileB])
    console.log()

    const rootB = fileB.data.compiled;
    const rendered = rootB.render();

    expect(rendered.children[1]).toMatchObject({
      type: 'link',
      title: 'Custom Title',
      url: './NoteA.mdl',
      children: [
        {type: 'text', value: 'Custom Title'}
      ]
    });
  })


  it ('Works with any method', () => {
    const noteB = `<script>
    import NoteA from './NoteA.mdl'
</script>
# Note B
{NoteA.ref()}
`

    const fileA = createVFile('./NoteA.mdl', noteA);
    const fileB = createVFile('./NoteB.mdl', noteB);

    parse([fileA, fileB])
    const out = compile([fileA, fileB])

    const rootB = fileB.data.compiled;
    const rendered = rootB.render();
    expect(rendered.children[1].type).toEqual('reference');
  });

  it ('It renders a KDL statement', () => {
    const kdlA = `symbol A as Action
statement 1 := state {A}
`
    const noteB = `<script>
    import A from './Action.kdl'
</script>
# Note B
{A.get('1').render()}
`

    const fileA = createVFile('./Action.kdl', kdlA);
    const fileB = createVFile('./NoteB.mdl', noteB);

    parse([fileA, fileB])
    const out = compile([fileA, fileB])

    const rootB = fileB.data.compiled;
    const rendered = rootB.render();
    expect(rendered.children[1].type).toEqual('paragraph');
    expect(rendered.children[1].children[0].value).toEqual('statement 1 := ');
  })
});


//
// describe('Parses simple MD', () => {
//   it('Parses MD heading', () => {
//     const mdl0 = `# Simple heading`
//     const out = {
//       type: "root",
//       children: [
//         {
//           type: 'heading',
//           depth: 1,
//           children: [
//             {type: 'text', value: 'Simple heading'}
//           ]
//         },
//       ]
//     }
//
//     expect(parse(mdl0)).toMatchObject(out);
//   });
// })
//
// describe('Parses the program in the script tag', () => {
//   it('Returns correct program type', () => {
//     const mdl0 = `<script>
//     import NoteA from './NoteA'
//     import NoteB from './NoteB'
// </script>
//
// Testing a mdx {Note.render()}
//
// Testing a mdx {Note.render({ style: 'filter: grayscale(0.2)' })}
//
// Testing a mdx reference {Note}
// `
//     let actual = parse(mdl0);
//     expect(actual.children[0].type).toEqual('Program')
//   });
//
//   it('Parses import declaration', () => {
//     const mdl0 = `<script>
//     import NoteA from './NoteA'
//     import NoteB from './NoteB'
// </script>`
//     let actual = parse(mdl0);
//     expect(actual.children[0].type).toEqual('Program')
//     expect(actual.children[0].body.length).toEqual(2)
//     expect(actual.children[0].body[0].type).toEqual('ImportDeclaration')
//   });
// })
//
//
// describe('Parses MDL specific nodes', () => {
//   it('Parses MDL node in the paragraph as mdxTextExpression', () => {
//     const mdl0 = `Text node {NoteA}`
//     let actual = parse(mdl0);
//     expect(actual.children[0].type).toEqual('paragraph')
//     expect(actual.children[0].children[1].type).toEqual('mdxTextExpression')
//   });
//
//   it('Parses MDL node at the beginning of sentence as mdxFlowExpression', () => {
//     const mdl0 = `{NoteA.render()}`
//     let actual = parse(mdl0);
//     expect(actual.children[0].type).toEqual('mdxFlowExpression')
//   });
// })
//
// describe('Compiles MDL files', () => {
//   it('Compiles two simple MDL files', () => {
//     const noteA = `<script>
//       import NoteB from './NoteB'
//   </script>
// # Note A
// {NoteB.render()}
// `
//     const noteB = `# Note B`
//
//     let astA = parse(noteA);
//     let astB = parse(noteB);
//
//     const out = compile([
//       {
//         path: './NoteA',
//         ast: astA
//       },
//       {
//         path: './NoteB',
//         ast: astB
//       }
//     ])
//
//     // Gives us a list of 2 roots
//     expect(out.length).toEqual(2);
//     // They come in exact order that we'd given it?
//     const outA = out[0];
//     const outB = out[1];
//     expect(outA).toBeInstanceOf(Root)
//     expect(outB.path).toEqual('./NoteB')
//     expect(outB.title).toEqual('Note B')
//     expect(outA.refs.get('NoteB')).toBe('./NoteB');
//   });
//
//   it('Compiles one comprehensive MDL file', () => {
//     const noteA = `# Comprehensive MD test
// ## Subheading
// > Quote
// > Another line of quote
//
// ~~How about strike~~ and **bold** and _italic_?
//
// How about thematic break —
// ***
//
// How about a link to a cool website: [MisesInstitute](https://mises.org/).
//
// And a cool image showing what AI today is capable of: ![](https://pbs.twimg.com/media/FQXpklcXsAEuOhJ.png)
//
// Some code
// \`\`\`javascript
//   import {DalleE2} from './DalleE2';
//
//   {DalleE2.render()}
// \`\`\`
//
// And some inline code too \`Math.PI\`
//
// ### That's a wrap
// `
//     let astA = parse(noteA);
//
//     const out = compile([
//       {
//         path: './NoteA',
//         ast: astA
//       },
//     ])
//
//     const outA = out[0];
//     expect(outA.refs.get('NoteB')).toBe('./NoteB');
//   });
//
//   it('Renders MDAST from two simple MDL files', () => {
//     const noteA = `<script>
//       import NoteB from './NoteB'
//   </script>
// # Note A
// {NoteB.render()}
// `
//     const noteB = `# Note B`
//
//     let astA = parse(noteA);
//     let astB = parse(noteB);
//
//     const out = compile([
//       {
//         path: './NoteA',
//         ast: astA
//       },
//       {
//         path: './NoteB',
//         ast: astB
//       }
//     ])
//
//     // Gives us a list of 2 roots
//     expect(out.length).toEqual(2);
//     // They come in exact order that we'd given it?
//     const outA = out[0];
//     const outB = out[1];
//     const outMDAST = outA.render()
//     expect(outMDAST).toMatchObject({
//       type: 'root',
//       children: [
//         {
//           type: 'heading',
//           depth: 1,
//           children: [
//             {
//               type: 'text',
//               value: 'Note A'
//             }
//           ]
//         },
//         {
//           type: 'root',
//           children: [
//             {
//               type: 'heading',
//               depth: 1,
//               children: [
//                 {
//                   type: 'text',
//                   value: 'Note B'
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     })
//   })
// })
