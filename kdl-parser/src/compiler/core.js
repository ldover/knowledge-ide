const {
  paragraph: p,
  heading: h,
  text: t,
  listItem: li,
  list: l,
  link
} = require("mdast-builder");

class Symbol {
  constructor(name, abbreviation) {
    this.name = name;
    this.abbreviation = abbreviation;
  }

  render() {
    return p(
      t(`def ${this.name}` + (this.abbreviation ? ` := ${this.abbreviation}` : ''))
    )
  }
}

class Statements {
  constructor(children) {
    this.children = children;
  }

  render() {
    return l(
      'ordered',
      this.children.map(c => c.render())
    )
  }
}


class Statement {
  constructor(name, value, children = [], options = {}) {
    this.name = name;
    this.value = value;
    this.nested = !!options.nested; // todo: I don't like separating this out arbitrarily
    this.parentName = options.parentName ? options.parentName : null;
    this.children = children;
  }

  render() {
    let kids = [p(this.value.map(c => c.render()))]
    if (this.children.length) {
      kids = [
        ...kids,
        new Statements(this.children).render()
      ]
    }

    return li(kids)
  }
}

class Reference {
  constructor(name) {
    this.name = name;
  }

  render() {
    return link(`#${this.name}`, this.name)
  }

  exists(scope) {
    return scope.has(name);
  }
}

class Text {
  constructor(value) {
    this.value = value;
  }

  render() {
    return t(this.value)
  }
}

class Root {
  constructor(children) {
    this.children = children;
  }

  render() {
    return {
      type: 'root',
      children: this.children.map(c => c.render())
    }
  }
}

//
// Compiler
//

const compilers = {
  statements: statementsCompiler,
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
  Statements,
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
  console.assert(ast.type === 'root')
  return new Root(ast.children.map(c => compilers[c.type](c)));
}

function statementsCompiler(ast) {
  console.assert(ast.type === 'statements')
  return new Statements(ast.children.map(node => compilers[node.type](node)));
}

function statementCompiler(ast) {
  console.assert(ast.type === 'statement')
  const value = ast.value.map(node => compilers[node.type](node));
  const children = ast.children ? ast.children.map(c => statementCompiler(c)) : []
  const options = {}
  ast.nested && (options.nested = ast.nested);
  ast.parentName && (options.parentName = ast.parentName);
  return new Statement(ast.name, value, children, options)
}

function textCompiler(ast) {
  console.assert(ast.type === 'text')

  return new Text(ast.value);
}

function referenceCompiler(ast) {
  console.assert(ast.type === 'reference')

  return new Reference(ast.value);
}
