import {
  paragraph as p,
  heading as h,
  text as t,
  listItem as li,
  list as l,
  link
} from "mdast-builder";

function getFileType(file) {
  // try to infer type
  if (file.path.endsWith('.mdl')) return 'mdl';
  if (file.path.endsWith('.kdl')) return 'kdl';

  return null;
}

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
  constructor(symbol, statement = null) {
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
        if (this.symbol) throw CompilerError('Symbol already declared: cannot yet two symbols per file');
        this.symbol = new Symbol(c.name, c.longName)
        this.refs.set(c.name, this.path)
        this.children.push(this.symbol)
      } else if (c.type === 'statement') {
        const statement = statementCompiler(c, this);
        this.children.push(statement);
        this.refs.set(c.name, this.path)
        this.statements.push(statement);
      } else if (c.type === 'proof') {
        throw CompilerError('proof compiler not yet implemented')
      } else {
        throw CompilerError('Unknown node: ' + c.type)
      }
    })
  }

  _processImport(statement) {
    console.assert(statement.type === 'import');
    // See that it is in fact in scope
    const importedObj = this.scope.get(statement.url);
    if (!importedObj) {
      throw new CompilerError(`Imported file not found: "${statement.url}"`)
    }

    this.addRef(statement.value, statement.url)
  }

  addRef(name, source) {
    if (!this.scope.has(source)) throw new CompilerError(`Source file not found in scope: ${name} (${source})`);
    this.refs.set(name, source);
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
    const type = getFileType(file);
    let rootObj;
    if (type !== 'kdl') {
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
  return new Statement(ast.name, value)
}

function textCompiler(ast) {
  console.assert(ast.type === 'text')

  return new Text(ast.value);
}

function referenceCompiler(ast, root) {
  console.assert(ast.type === 'reference')

  let path = root.refs.has(ast.symbol);
  if (!path) {
    throw CompilerError('Reference failed to compile, variable not initialized: ' + ast.symbol )
  }

  // todo: check for statement at compile time as well
  let statement = ast.statement ? ast.statement : null;
  return new Reference(ast.symbol, statement);
}


export {
  Symbol,
  Statement,
  Reference,
  Root,
  Text,
  compile
}
