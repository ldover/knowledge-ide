import {parse} from '../src/parser/index';

describe('Parses simple MD', () => {
  it('Parses MD heading', () => {
    const mdl0 = `# Simple heading`
    const out = {
      type: "root",
      children: [
        {
          type: 'heading',
          depth: 1,
          children: [
            { type: 'text', value: 'Simple heading'}
          ]
        },
      ]
    }

    expect(parse(mdl0)).toMatchObject(out);
  });
})

describe('Parses the program in the script tag', () => {
  it('Returns correct program type', () => {
    const mdl0 = `<script>
    import NoteA from './NoteA'
    import NoteB from './NoteB'
</script>`
    let actual = parse(mdl0);
    expect(actual.children[0].type).toEqual('Program')
  });

  it('Parses import declaration', () => {
    const mdl0 = `<script>
    import NoteA from './NoteA'
    import NoteB from './NoteB'
</script>`
    let actual = parse(mdl0);
    expect(actual.children[0].type).toEqual('Program')
    expect(actual.children[0].body.length).toEqual(2)
    expect(actual.children[0].body[0].type).toEqual('ImportDeclaration')
  });
})


