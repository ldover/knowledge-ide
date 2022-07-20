const fs = require('fs');

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
  const match = line.match(/([0-9\.]+):(.*)/)
  let name = match[1];
  let value = parseStatementValue(match[2]);

  const statement = {
    type: 'statement',
    name,
    value,
    children: [],
  };

  const nested = name.includes('.');
  let parentName = null;
  let childName = null;
  if (nested) {
    [parentName, childName] = name.split('.');
    statement.name = childName;
    statement.nested = true;
    statement.parentName = parentName
  }

  return statement;
}


function parse(kdl) {
  const lines = kdl.split('\n');
  const statements = {}
  const children = []
  lines.forEach(line => {
    if (!line) return;
    line = line.trim();

    if (line.startsWith('def')) {
      const parts = line.split(' ').filter(part => part && part !== ' ');
      const [_, name, _2, abbreviation] = parts;
      children.push(
        {
          type: 'symbol',
          name,
          abbreviation: abbreviation ? abbreviation : null
        }
      )
    } else if (line.match(/[0-9\.]+/)) {
      const statement = parseStatement(line);

      // Goes only one level deep (todo)
      if (statement.nested) {
        statements[statement.parentName].children.push(statement); // Will error — should proactively show error (todo)
      } else {
        statements[statement.name] = statement;
        children.push(statement)
      }
    }
  })


  return {
    type: "root",
    children: children,
  }
}

function parseFile(path) {
  const contents = fs.readFileSync(path, {encoding: 'utf-8'})
  return parse(contents);
}

module.exports = {
  parse,
  parseFile
}