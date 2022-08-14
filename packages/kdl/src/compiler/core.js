import {
  paragraph as p,
  heading as h,
  text as t,
  listItem,
  list,
  link,
  inlineCode
} from "mdast-builder";
import {computeAbsolutePath} from "@knowledge/common";


class Symbol {
  constructor(name, longName, root) {
    this.name = name;
    this.longName = longName;
    this.root = root;
  }

  render() {
    return {
      type: 'symbol',
      name: this.name,
      longName: this.longName,
      symbol: this,
      root: this.root
    }
  }

  ref(title = null) {
    title = title || `${this.name}`
    return this.root.ref(title)
  }
}

class Statement {
  constructor(name, value = [], proof = null, root) {
    this.name = name;
    this.value = value;
    this.root = root;
    this.proof = proof;
  }

  render() {
    return {
      type: 'statement',
      proven: !!this.proof,
      name: this.name,
      children: this.value.map(n => n.render()),
      statement: this,
    }
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
    return {
      name: this.statement.name,
      statement: this.statement,
      proof: this,
    }
  }
}

class Reference {
  constructor(symbol, statement = null, root) {
    this.symbol = symbol;
    this.statement = statement;
    this.root = root;
  }

  getStatement() {
    if (this.statement) {
      const source = this.root.refs.get(this.symbol);
      const rootFile = this.root.scope.get(source);
      return rootFile.statements.find(s => s.name === this.statement)
    }

    return null;
  }

  render() {
    const title = `${this.symbol}${this.statement ? ':' + this.statement : ''}`
    console.log('render()', {reference: this, root: this.root});
    const filepath = this.root.refs.get(this.symbol);
    const obj = this.root.scope.get(filepath);
    return obj.ref(title);
  }
}

class MathExpression {
  constructor(value) {
    this.value = value;
  }

  render() {
    return inlineCode(this.value)
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

    /** @type {Reference[]}*/
    this.references = [];
  }

  init() {
    this.ast.children.forEach(c => {
      if (c.type === 'import') {
        this._processImport(c)
      } else if (c.type === 'symbol') {
        if (this.symbol) throw new CompilerError('Symbol already declared: cannot yet two symbols per file');
        this.symbol = new Symbol(c.name, c.longName, this)
        this.refs.set(c.name, this.path)
      } else if (c.type === 'statement') {
        const statement = statementCompiler(c, this);
        this.statements.push(statement);
      } else if (c.type === 'proof') {
        const proof = proofCompiler(c, this);
        proof.statement.proof = proof;
        this.proofs.push(proof);
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

  getTitle() {
    return  this.symbol.longName ? this.symbol.longName + ` (${this.symbol.name})` : this.symbol.name;
  }

  render() {
    return {
      type: 'root',
      children: [
        h(1, t(this.getTitle())),
        ...this.statements.map(s => s.render()),
        {
          type: 'thematicBreak'
        },
        ...this._renderBacklinks()
      ]
    }
  }

  _renderBacklinks() {
    // Find references in other root files
    const files = []
    for (const [path, rootFile] of this.scope.entries()) {
      if (!rootFile.path.endsWith('.kdl')) continue;
      const statements = rootFile.statements;
      const referencedStatements = [];
      statements.forEach(s => {
        const refs = s.value.filter(v => v instanceof Reference);
        const isReferenced = refs.find(r => r.symbol === this.symbol.name); // todo: might be imported under other name so use root.refs, root.scope
        if (isReferenced) {
          referencedStatements.push(s)
        }
      })

      if (statements.length) {
        files.push({file: rootFile, statements: referencedStatements})
      }
    }

    const children = files.map(({file, statements}) => {
      return listItem([
          t(file.getTitle()),
          list("unordered", statements.map(s => listItem(s.render())))
        ]
      )
    })

    return [
      h(2, t('References')),
      list("unordered", children)
    ]
  }
}

//
// Compiler
//

const compilers = {
  statement: statementCompiler,
  text: textCompiler,
  reference: referenceCompiler,
  math: mathCompiler,
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
  return new Statement(ast.name, value, null, root)
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

function mathCompiler(ast) {
  console.assert(ast.type === 'math')

  return new MathExpression(ast.value);
}

function referenceCompiler(ast, root) {
  console.assert(ast.type === 'reference')

  let path = root.refs.has(ast.symbol);
  if (!path) {
    throw new CompilerError('Reference failed to compile, variable not initialized: ' + ast.symbol )
  }

  // todo: check for statement at compile time as well
  let statement = ast.statement ? ast.statement : null;
  const reference = new Reference(ast.symbol, statement, root);
  root.references.push(reference);
  return reference
}


export {
  Symbol,
  Statement,
  Reference,
  MathExpression,
  Root,
  Text,
  Proof,
  compile
}
