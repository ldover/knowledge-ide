
function parseStatementValue(statement) {
  return [{
    type: 'text',
    value: statement.trim()
  }]
}

function parse(kdl) {
  const lines = kdl.split('\n');
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
      const match = line.match(/([0-9\.]+):(.*)/)
      children.push({
        type: 'statement',
        name: match[1],
        value: parseStatementValue(match[2])
      })
    }

  })


  return {
    type: "root",
    children: children,
  }
}

module.exports = {parse}