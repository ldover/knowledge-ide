import {
  paragraph as p,
  heading as h,
  text as t,
  listItem as li,
  list as l,
  link
} from "mdast-builder";
import {computeAbsolutePath} from "@knowledge/common";


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
  constructor(name, value = [], root) {
    this.name = name;
    this.value = value;
    this.root = root;
  }

  render() {
    return p([t(`statement ${this.name} := `), ...this.value.map(c => c.render())])
  }

  ref(title = null) {
    title = title || `${this.root.symbol.name}:${this.name}`
    return this.root.ref(title)
  }
}

class Proof {
  constructor(statement, statements = [], root) {
    this.statement = statement;
    this.statements = statements;
    this.root = root;
  }

  render() {
    return l('unordered', [
      li(t(`proof §${this.statement.name}`)),
      l('ordered', this.statements.map(statement => li(statement.render())))
    ])
  }
}

class Reference {
  constructor(symbol, statement = null, root) {
    this.symbol = symbol;
    this.statement = statement;
    this.root = root;
  }

  render() {
    const title = `${this.symbol}${this.statement ? ':' + this.statement : ''}`
    console.log('render()', {reference: this, root: this.root});
    const filepath = this.root.refs.get(this.symbol);
    const obj = this.root.scope.get(filepath);
    return obj.ref(title);
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
  constructor(path, ast, scope) {
    this.path = path;
    this.ast = ast;
    this.scope = scope;
    this.refs = new Map(); // Map<name, source> — name is used in the MDL script as variable name, while source is actual file name

    this.children = [];

    this.symbol = null;
    this.statements = [];
    this.proofs = [];
  }

  init() {
    this.ast.children.forEach(c => {
      if (c.type === 'import') {
        this._processImport(c)
      } else if (c.type === 'symbol') {
        if (this.symbol) throw new CompilerError('Symbol already declared: cannot yet two symbols per file');
        this.symbol = new Symbol(c.name, c.longName)
        this.refs.set(c.name, this.path)
        this.children.push(this.symbol)
      } else if (c.type === 'statement') {
        const statement = statementCompiler(c, this);
        this.children.push(statement);
        this.statements.push(statement);
      } else if (c.type === 'proof') {
        const proof = proofCompiler(c, this);
        this.proofs.push(proof);
        this.children.push(proof);
      } else {
        throw new CompilerError('Unknown node: ' + c.type)
      }
    })
  }

  _processImport(statement) {
    console.assert(statement.type === 'import');
    // See that it is in fact in scope

    const path = computeAbsolutePath(this.path, statement.url);
    const importedObj = this.scope.get(path);
    if (!importedObj) {
      throw new CompilerError(`Imported file not found: "${statement.url}"`)
    }

    this.addRef(statement.value, path)
  }

  addRef(name, source) {
    this.refs.set(name, source);
  }

  ref(title = null) {
    title = title || this.symbol.name;
    return {
      type: 'reference',
      url:`#/${this.path.replace('~/', '')}`, // todo: I'm building in this assumption of files starting with "~/" which is only true atm
      title
    }
  }


  get(statementName) {
    return this.statements.find(s => s.name === statementName);
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
}


export class CompilerError extends Error {
  constructor(message, loc = null, node = null) {
    super(message);
    this.name = "CompilerError";
    this.loc = loc;
    this.node = node;
  }
}

/**
 * KDL AST of each file should be at file.data.parsed
 * @param {VFile[]} files
 */
function compile(files) {
  const scope = new Map(); // Map<path, Root>

  // Build scope of all files
  files.forEach(file => {
    const type = file.extname;
    let rootObj;
    if (type !== '.kdl') {
      throw new Error('Unsupported file type: ' + file.path);
    }

    rootObj = new Root(file.path, file.data.parsed, scope)

    scope.set(file.path, rootObj);
  })

  // Now that we have the scope, init each KDL file
  files.forEach(file => {
    const root = scope.get(file.path);
    root.init()
    file.data.compiled = root;
  })

  return files;
}

function statementCompiler(ast, root) {
  console.assert(ast.type === 'statement')
  const value = ast.value.map(node => compilers[node.type](node, root));
  root.addRef(ast.name, root.path)
  return new Statement(ast.name, value, root)
}

function proofCompiler(ast, root) {
  console.assert(ast.type === 'proof')
  const statements = ast.statements.map(node => statementCompiler(node, root));
  const statement = root.get(ast.statementReference);
  return new Proof(statement, statements, root)
}

function textCompiler(ast) {
  console.assert(ast.type === 'text')

  return new Text(ast.value);
}

function referenceCompiler(ast, root) {
  console.assert(ast.type === 'reference')

  let path = root.refs.has(ast.symbol);
  if (!path) {
    throw new CompilerError('Reference failed to compile, variable not initialized: ' + ast.symbol )
  }

  // todo: check for statement at compile time as well
  let statement = ast.statement ? ast.statement : null;
  return new Reference(ast.symbol, statement, root);
}


export {
  Symbol,
  Statement,
  Reference,
  Root,
  Text,
  Proof,
  compile
}
