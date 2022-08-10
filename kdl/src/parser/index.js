import {knowledgeLanguage} from "codemirror-lang-knowledge";


export function parse(kdl) {
  const parser = knowledgeLanguage.parser;
  let tree = parser.parse(kdl)
  let nodes = [];
  let cursor = tree.cursor()
  do {
    nodes.push({
      name: cursor.name,
      from: cursor.from,
      to: cursor.to,
      value: kdl.slice(cursor.from, cursor.to)
    })
  } while (cursor.next())

// console.log(nodes)
  const nodeTypes = new Set(['Program', 'ProofDeclaration', 'StatementDeclaration', 'StatementName', 'SymbolDeclaration', 'SymbolName', 'SymbolLongName', 'Identifier', 'ProofBody', 'StatementValue', 'Text', 'Reference', 'CompoundReference'])
  const filteredNodes = nodes.filter(n => nodeTypes.has(n.name));

  function createNode(node, nodes) {
    if (!nodes.length) return node;

    const _node = {
      ...node,
      children: []
    }

    let nodeIndex = 0;
    while (nodeIndex <= nodes.length - 1) {
      // For each child node (in nodes) take the range [from, to] to create a subset of nodes
      // If empty, then just push the child
      // If range contains nodes, then call createNode recursively

      let nextChild = nodes[nodeIndex];
      let nextChildChildren = nodes.slice(nodeIndex + 1).filter(n => n.to <= nextChild.to);
      // Increment node index so we can create next sibling
      nodeIndex = nodeIndex + 1 + nextChildChildren.length;
      _node.children.push(createNode(nextChild, nextChildChildren));
    }
    return _node;
  }

  const ast = createNode(filteredNodes[0], filteredNodes.slice(1))

  return toKdlAST(ast)
}

/**
 * Turn tree produced by Lezer to KDL AST
 * @param ast
 */
function toKdlAST(ast) {
  const _parsers = {
    Program: function (node) {
      return {
        type: 'root',
        children: node.children.map(n => this[n.name](n))
      };
    },
    SymbolDeclaration: function (node) {
      return {
        type: 'symbol',
        name: node.children.find(n => n.name === 'SymbolName').value,
        longName: node.children.find(n => n.name === 'SymbolLongName')?.value || null
      }
    },
    StatementDeclaration: function (node) {
      return {
        type: 'statement',
        name: node.children.find(n => n.name === 'StatementName').value,
        value: node.children.find(n => n.name === 'StatementValue').children.map(n => this[n.name](n))
      }
    },
    Text: function (node) {
      return {
        type: 'text',
        value: node.value
      }
    },
    Reference: function (node) {
      return {
        type: 'reference',
        symbol: node.value.replace(/[\{\}]/g, '')
      }
    },
    CompoundReference: function (node) {
      const match = node.value.match(/\{(.*):(.*)\}/)

      return {
        type: 'reference',
        symbol: match[1],
        statement: match[2]
      }
    },
    ProofDeclaration: function (node) {
      return {
        type: 'proof',
        statementReference: node.children.find(n => n.name === 'StatementName').value,
        statements: node.children.find(n => n.name === 'ProofBody').children.filter(s => s.name === 'StatementDeclaration').map(n => this.StatementDeclaration(n))
      }
    },
    ImportDeclaration: function (node) {
      return {
        type: 'import',
        value: node.children.find(n => n.name === 'Identifier').value,
        url: node.children.find(n => n.name === 'String').value,
      }
    },
  }

  return _parsers[ast.name](ast)
}
