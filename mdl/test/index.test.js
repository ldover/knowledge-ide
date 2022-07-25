import {parse} from '../src/parser/index';

describe('Parses symbol', () => {
  it('Works with one line', () => {
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


