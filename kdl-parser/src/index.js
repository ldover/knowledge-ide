
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
    }

  })


  return {
    type: "root",
    children: children,
  }
}

module.exports = {parse}