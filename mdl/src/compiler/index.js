import {
  paragraph,
  heading as h,
  text as t,
  listItem,
  list,
  link,
  blockquote,
  code,
  inlineCode,
  image,
  strong,
  strike,
  root, emphasis,
} from "mdast-builder";

/**
 * Accepts MDL ASTs outputs objects
 * @param {Array} mdl
 */
function compile(mdl) {
  const scope = new Map(); // Map<path, Root>

  // Build scope of all files
  mdl.forEach(({path, ast}) => {
    scope.set(path, new Root(path, ast, scope));
  })

  // Now that we have the scope, init each file
  return mdl.map(({path}) => {
    const root = scope.get(path);
    root.init()
    return root;
  })
}

function headingCompiler(node, root) {
  if (node.depth === 1) {
    if (root.title) {
      throw new Error('Cannot have multiple headings of depth 1')
    } else {
      root.title = node.children[0].value; // todo: here we assume one neat scenario of heading having only one text node, not a host of children of different types
    }
  }

  return new Heading(node.depth, node.children.map(n => Compilers[n.type](n, root)));
}

function mdxTextExpressionCompiler(node, root) {
  // Run the reference against root to check whether it matches
  const statement = node.data.estree.body[0]; // todo: assumes one
  console.assert(statement.type === 'ExpressionStatement');
  const refName = statement.expression.callee.object.name;
  if (!root.refs.has(refName)) throw new Error(`Variable not initialized: ${refName}`)

  return new MdxTextExpression(statement.expression, root);
}

function mdxFlowExpressionCompiler(node, root) {
  // Run the reference against root to check whether it matches
  const statement = node.data.estree.body[0]; // todo: assumes one
  console.assert(statement.type === 'ExpressionStatement');
  const refName = statement.expression.callee.object.name;
  if (!root.refs.has(refName)) throw new Error(`Variable not initialized: ${refName}`)
  if (!Reflect.has(root, statement.expression.callee.property.name)) throw new Error(`Root does not have property: ${statement.expression.callee.property.name}`)

  return new MdxFlowExpression(statement.expression, root)
}

function textCompiler(node, root) {
  return new Text(node.value)
}

function nodeWithChildrenCompiler(type, node, root) {
  return new type(node.children.map(n => Compilers[n.type](n, root)))
}

let Compilers = {
  heading: headingCompiler,
  text: textCompiler,
  break: () => new Break(),
  thematicBreak: () => new ThematicBreak(),
  paragraph: (node, root) => nodeWithChildrenCompiler(Paragraph, node, root),
  blockquote: (node, root) => nodeWithChildrenCompiler(Blockquote, node, root),
  strong: (node, root) => nodeWithChildrenCompiler(Strong, node, root),
  emphasis: (node, root) => nodeWithChildrenCompiler(Emphasis, node, root),
  strike: (node, root) => nodeWithChildrenCompiler(Strike, node, root),
  list: (node, root) => new List(node.children.map(n => Compilers[n.type](n, root)), node.ordered),
  listItem: (node, root) => nodeWithChildrenCompiler(ListItem, node, root),
  link: (node, root) => new Link(node.url, node.title, node.children.map(n => Compilers[n.type](n, root))),
  image: (node, root) => new Image(node.url, node.title, node.alt, node.children ? node.children.map(n => Compilers[n.type](n, root)): []),
  code: (node, root) => new Code(node.value, node.lang),
  inlineCode: (node, root) => new InlineCode(node.value),
  mdxFlowExpression: mdxFlowExpressionCompiler,
  mdxTextExpression: mdxTextExpressionCompiler,
}

function programCompiler(program, root) {
  // Basically handle the imports
  program.body.forEach(statement => {
    if (statement.type === 'ImportDeclaration') {
      // See that it is in fact in scope
      const importedObj = root.scope.get(statement.source.value);
      if (!importedObj) {
        throw new Error('Imported file not found: ', specifier.source.value)
      }

      let identifier;
      statement.specifiers.forEach(specifier => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          identifier = specifier
        } else {
          throw new Error('Non default specifier not implemented')
        }
      })

      root.addRef(identifier.local.name, statement.source.value)


    } else {
      console.warn('Statement type not supported:', statement.type);
    }
  })
}

class Root {
  constructor(path, ast, scope) {
    this.path = path;
    this.ast = ast;
    this.scope = scope;
    this.refs = new Map(); // Map<name, source> — name is used in the MDL script as variable name, while source is actual file name

    this.title = null;
    this.children = [];
  }

  init() {
    // Search for program
    let program = this.ast.children.find(c => c.type === 'Program');
    if (program) {
      try {
        programCompiler(program, this);
      } catch (err) {
        console.error(`Failed to compile file: ${this.path}`); // todo: throw an error here and include error message from programCompiler
        throw err;
      }
    }

    // Then compile all children
    this.children = this.ast.children
      .filter(n => n.type !== 'Program')
      .map(node => Compilers[node.type](node, this)) // Pass 'this' reference so sub-compilers can modify the root and run bottom-up checks
  }

  addRef(name, source) {
    // todo: we'll probably have to compute based on absolute this.path of this Root
    if (!this.scope.has(source)) throw new Error(`Source file not found in scope: ${name} (${source})`);
    this.refs.set(name, source);
  }

  render() {
    return root(this.children.map(c => c.render()))
  }

  getObject(ref) {
    return this.scope.get(this.refs.get(ref))
  }
}

class MdxTextExpression {
  constructor(expression, root) {
    this.expression = expression;
    this.root = root;
  }

  // Becomes a MDAST link
  // todo: worth thinking through if we should introduce another node so we can integrate with the UI better, or if we can structure the link in a way that we can derive everything we need on the Notebase UI side
  render() {
    const objName = this.expression.callee.object.name;
    const obj = this.root.getObject(objName);

    return link(
      objName,
      objName,
      t(obj.title)
    )
  }
}

class MdxFlowExpression {
  constructor(expression, root) {
    this.expression = expression;
    this.root = root;
  }

  render() {
    // EX — When {NoteA.render()}, look up object
    const objName = this.expression.callee.object.name;
    const propName = this.expression.callee.property.name;
    const obj = this.root.getObject(objName);
    return obj[propName].call(obj)
  }
}

class List {
  constructor(children, ordered) {
    this.children = children;
    this.ordered = ordered;
  }

  render() {
    return list(
      this.ordered,
      this.children.map(c => c.render())
    )
  }
}

class ListItem {
  constructor(children) {
    this.children = children;
  }

  render() {
    return listItem(this.children.map(c => c.render()))
  }
}

class Heading {
  constructor(depth, children) {
    this.depth = depth;
    this.children = children;
  }

  render() {
    return h(this.depth, this.children.map(c => c.render()));
  }
}

class Paragraph {
  constructor(children) {
    this.children = children;
  }

  render() {
    return paragraph(this.children.map(c => c.render()));
  }
}

class Text {
  constructor(value) {
    this.value = value;
  }

  render() {
    return t(this.value);
  }
}

class Strong {
  constructor(children) {
    this.children = children;
  }

  render() {
    return strong(this.children.map(c => c.render()));
  }
}

class Emphasis {
  constructor(children) {
    this.children = children;
  }

  render() {
    return emphasis(this.children.map(c => c.render()));
  }
}


class Strike {
  constructor(children) {
    this.children = children;
  }

  render() {
    return strike(this.children.map(c => c.render()));
  }
}

class Break {
  render() {
    return {
      type: "break"
    }
  }
}

class ThematicBreak {
  render() {
    return {
      type: "thematicBreak"
    }
  }
}

class Blockquote {
  constructor(children) {
    this.children = children;
  }

  render() {
    return blockquote(this.children.map(c => c.render()));
  }
}

class Image {
  constructor(url, title = null, alt = null, children = []) {
    this.url = url;
    this.title = title;
    this.children = children;
  }

  render() {
    return image(this.url, this.title, this.alt, this.children.map(c => c.render()));
  }
}

class Link {
  constructor(url, title, children) {
    this.url = url;
    this.title = title;
    this.children = children;
  }

  render() {
    return link(this.url, this.title, this.children.map(c => c.render()));
  }
}

class InlineCode {
  constructor(value) {
    this.value = value;
  }

  render() {
    return inlineCode(this.value);
  }
}

class Code {
  constructor(value, lang = null) {
    this.value = value;
    this.lang = lang;
  }

  render() {
    return code(this.lang, this.value);
  }
}

export {
  compile,
  Root
}