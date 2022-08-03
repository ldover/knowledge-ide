import {parse} from '../src';
import {compile, Root} from "../src/compiler/index.js";
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
    console.log()

    const rootB = fileB.data.compiled;
    const rendered = rootB.render();
    expect(rendered.children[1].type).toEqual('link');
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
//   // TODO: the render() should probably always be in the new line — make a test for that
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
