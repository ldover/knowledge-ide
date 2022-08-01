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
      children.push({
        type: 'reference',
        value: match[1]
      })
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
  const children = []
  lines.forEach(line => {
    if (!line) return;

    if (line.startsWith('symbol')) {
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
    }
  })

  return {
    type: "root",
    children: children,
  }
}



export {
  parse,
}