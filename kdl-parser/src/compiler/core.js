class Symbol {
  constructor(name, abbreviation) {
    this.name = name;
    this.abbreviation = abbreviation;
  }
}

class Statement {
  constructor(name, value, children = []) {
    this.name = name;
    this.value = value;
    this.children = children;
  }
}

class Reference {
  constructor(name) {
    this.name = name;
  }

  exists(scope) {
    return scope.has(name);
  }
}

class Text {
  constructor(value) {
    this.value = value;
  }
}

class Root {
  constructor(children) {
    this.children = children;
  }
}

//
// Compiler
//

const compilers = {
  statement: statementCompiler,
  text: textCompiler,
  reference: referenceCompiler,
  symbol: symbolCompiler,
  root: rootCompiler
}

function compile(ast) {
  // if (ast.type !== 'root') throw Error('Invalid AST: top level should be of type `root`');
  const compiler = compilers[ast.type];
  if (!compiler) throw Error('No compiler found for node of type: ' + ast.type);

  return compiler(ast);
}

module.exports = {
  Symbol,
  Statement,
  Reference,
  Root,
  Text,
  compile
}

function symbolCompiler(ast) {
  console.assert(ast.type === 'symbol')

  return new Symbol(ast.name, ast.abbreviation)
}

function rootCompiler(ast) {
  console.assert(ast.type === 'symbol')
  return new Root(ast.children.map(c => compilers[c.type](c)));
}

function statementCompiler(ast) {
  console.assert(ast.type === 'statement')
  const value = ast.value.map(node => compilers[node.type](node));
  const children = ast.children ? ast.children.map(c => statementCompiler(c)) : []
  return new Statement(ast.name, value, children)
}

function textCompiler(ast) {
  console.assert(ast.type === 'text')

  return new Text(ast.value);
}

function referenceCompiler(ast) {
  console.assert(ast.type === 'reference')

  return new Reference(ast.value);
}
