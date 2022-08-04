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
import {VFile} from "vfile";

import {Root as KDLRoot} from '../../../kdl/src/compiler/core';
import {computeAbsolutePath} from "../../../kdl/src/util.js";
import {toJs} from "estree-util-to-js";

/**
 * Accepts MDL ASTs outputs objects
 * @param {VFile[]} files
 */
function compile(files) {
  const scope = new Map(); // Map<path, Root>

  // Build scope of all files
  files.forEach(file => {
    const type = getFileType(file);
    let rootObj;
    if (type === 'mdl') {
      rootObj = new Root(file.path, file.data.parsed, scope)
    } else if (type === 'kdl') {
      rootObj =  new KDLRoot(file.path, file.data.parsed, scope)
    } else {
      throw new CompilerError('Unsupported file type: ' + file.path);
    }

    scope.set(file.path, rootObj);
  })

  // Now that we have the scope, init each MDL file
  files.forEach(file => {
    const root = scope.get(file.path);
    root.init()
    file.data.compiled = root;
  })

  return files;
}


export function getFileType(file) {
  // try to infer type
  if (file.path.endsWith('.mdl')) return 'mdl';
  if (file.path.endsWith('.kdl')) return 'kdl';

  return null;
}


export class CompilerError extends Error {
  constructor(message, loc = null, node = null) {
    super(message);
    this.name = "CompilerError";
    this.loc = loc;
    this.node = node;
  }
}

function headingCompiler(node, root) {
  if (node.depth === 1) {
    if (root.title) {
      throw new CompilerError('Cannot have multiple headings of depth 1', node.position, node)
    } else {
      root.title = node.children[0].value; // todo: here we assume one neat scenario of heading having only one text node, not a host of children of different types
    }
  }

  return new Heading(node.depth, node.children.map(n => Compilers[n.type](n, root)));
}

function mdxFlowExpressionCompiler(node, root) {
  return new MdxFlowExpression(node.data.estree, root)
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
  mdxTextExpression: mdxFlowExpressionCompiler,
}

function programCompiler(program, root) {
  // Basically handle the imports
  program.body.forEach(statement => {
    if (statement.type === 'ImportDeclaration') {
      // See that it is in fact in scope
      const path = computeAbsolutePath(root.path, statement.source.value);

      const importedObj = root.scope.get(path);
      if (!importedObj) {
        throw new CompilerError(`Imported file not found: "${statement.source.value}"`, {
          start: statement.start,
          end: statement.start,
        })
      }

      let identifier;
      statement.specifiers.forEach(specifier => {
        if (specifier.type === 'ImportDefaultSpecifier') {
          identifier = specifier
        } else {
          throw new CompilerError('Non default specifier not implemented', {
            start: statement.start,
            end: statement.start,
          })
        }
      })

      root.addRef(identifier.local.name, path)
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
      programCompiler(program, this);
    }

    // Then compile all children
    this.children = this.ast.children
      .filter(n => n.type !== 'Program')
      .map(node => Compilers[node.type](node, this)) // Pass 'this' reference so sub-compilers can modify the root and run bottom-up checks
  }

  addRef(name, source) {
    this.refs.set(name, source);
  }

  render(options = {}) {
    const renderHeading = 'heading' in options ? options.heading : true;
    let renderChildren = [...this.children];

    if (!renderHeading) {
      renderChildren = renderChildren.filter(n => !(n instanceof Heading && n.depth === 1));
    }

    return root(renderChildren.map(c => c.render()))
  }

  ref(title = null) {
    title = title || this.title;
    return {
      type: 'reference',
      url:`#/${this.path}`,
      title
    }

  }

  getObject(ref) {
    return this.scope.get(this.refs.get(ref))
  }
}


class MdxFlowExpression {
  constructor(estree, root) {
    this.estree = estree;
    this.root = root;
  }

  render() {

    const obj = this._processEstree(this.estree)
    if ('type' in obj) { // if mdast node
      return obj;
    } else if (obj.ref) {
      return obj.ref()
    } else {
      throw CompilerError('Could not process expression')
    }
  }

  _processEstree(expression) {
    // Build scope of imported objects
    let scope = {};
    for (let [name, path] of this.root.refs.entries()) {
      scope[name] = this.root.scope.get(path);
    }

    const handlers = {
      Identifier: (node, state) => {
        if (node.name in scope) {
          state.write(`scope["${node.name}"]`)
        } else {
          state.write(node.name)
        }
      }
    }

    const jsString = toJs(this.estree, {handlers});
    return eval(jsString.value);
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
