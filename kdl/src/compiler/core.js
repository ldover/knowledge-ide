import {
  paragraph as p,
  heading as h,
  text as t,
  listItem as li,
  list as l,
  link
} from "mdast-builder";

class Symbol {
  constructor(name, longName) {
    this.name = name;
    this.longName = longName;
  }

  render() {
    return p(
      t(`symbol ${this.name}` + (this.longName ? ` as ${this.longName}` : ''))
    )
  }
}

class Statement {
  constructor(name, value = []) {
    this.name = name;
    this.value = value;
  }

  render() {
    return p([t(`statement ${this.name} := `), ...this.value.map(c => c.render())])
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

function symbolCompiler(ast) {
  console.assert(ast.type === 'symbol')

  return new Symbol(ast.name, ast.longName)
}

function rootCompiler(ast) {
  console.assert(ast.type === 'root')
  return new Root(ast.children.map(c => compilers[c.type](c)));
}

function statementCompiler(ast) {
  console.assert(ast.type === 'statement')
  const value = ast.value.map(node => compilers[node.type](node));
  return new Statement(ast.name, value)
}

function textCompiler(ast) {
  console.assert(ast.type === 'text')

  return new Text(ast.value);
}

function referenceCompiler(ast) {
  console.assert(ast.type === 'reference')

  return new Reference(ast.value);
}


export {
  Symbol,
  Statement,
  Reference,
  Root,
  Text,
  compile
}
