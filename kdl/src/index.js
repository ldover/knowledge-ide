import {compile} from './compiler/core.js'

function parseStatementValue(statement) {
  let s = statement.trim()

  const matches = [...s.matchAll(/\{(.*?)\}/g)];
  if (!matches.length) {
    return [{
      type: 'text',
      value: s
    }]
  } else {
    let children = []

    // Everything between matches is text node
    let cursor = 0;
    matches.forEach(match => {
      if (match.index > cursor) {
        // Create text node until the index of the match
        children.push({
          type: 'text',
          value: s.substring(cursor, match.index)
        })
      }

      cursor = match.index + match[0].length;
      if (match[1].includes(':')) {
        const subMatch = match[1].match(/(.+):(.+)/)
        children.push({
          type: 'reference',
          symbol: subMatch[1],
          statement: subMatch[2],
        })
      } else {
        children.push({
          type: 'reference',
          symbol: match[1]
        })
      }
    })

    return children;
  }
}

function parseStatement(line) {
  const match = line.match(/([0-9\.]+)\s*:=\s*(.*)/)
  let name = match[1];
  let value = parseStatementValue(match[2]);

  return {
    type: 'statement',
    name,
    value,
  };
}


function parse(kdl) {
  const lines = kdl.split('\n');
  const children = [];
  let parsingProof = false;
  let proof = {
    statementReference: null,
    statements: [],
  }

  lines.forEach(line => {
    if (!line) return;

    if (line.startsWith('proof')) {
      parsingProof = true
      let match = line.match(/proof\s+§(.+?)\s+\{/);
      if (!match || !match[1]) {
        throw new Error("Parser failed to parse proof: " + line)
      }

      proof.statementReference = match[1];
      return;
    } else if (parsingProof && line.startsWith('}')) {
      parsingProof = false;
      children.push({
        type: 'proof',
        ...proof
      })

      proof.statementReference = null;
      proof.statements = [];
      return;
    }

    if (parsingProof) {
      line = line.trim();
      if (line.startsWith('statement')) {
        const statement = parseStatement(line);
        proof.statements.push(statement)
      }
    } else if (line.startsWith('symbol')) {
      const parts = line.split(' ').filter(part => part && part !== ' ');
      const [_, name, _2, longName] = parts;
      children.push(
        {
          type: 'symbol',
          name,
          longName: longName ? longName : null
        }
      )
    } else if (line.startsWith('statement')) {
      const statement = parseStatement(line);
      children.push(statement)
    } else if (line.startsWith('use')) {
      // todo: this regex allows differentt type of opening and closing quotes, e.g.: './X.kdl"
      const match = line.match(/use\s+(.+?)\s+of\s+["'](.+)["']/)
      if (!match || !match[1] || !match[2]) throw Error('Incorrect import syntax: ' + line);
      children.push({
        type: 'import',
        value: match[1],
        url: match[2],
      })
    }
  })

  return {
    type: "root",
    children: children,
  }
}



export {
  parse,
  compile
}
