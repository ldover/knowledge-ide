import {get, writable} from "svelte/store";
import {basicSetup, EditorView} from "codemirror";
import {markdown, markdownLanguage} from "@codemirror/lang-markdown";
import {knowledge, knowledgeLanguage} from '@knowledge/codemirror-lang-knowledge';
import {languages} from "@codemirror/language-data";
import {indentWithTab} from "@codemirror/commands"
import {keymap} from "@codemirror/view"
import {Strikethrough} from "@lezer/markdown";
import {parser as jsParser} from "@lezer/javascript"
import {parseMixed} from "@lezer/common"
import {VFile} from 'vfile'
import {HighlightStyle, syntaxHighlighting, syntaxTree} from "@codemirror/language"
import {javascriptLanguage} from "@codemirror/lang-javascript"
import {tags} from "@lezer/highlight";
import {computeRelativePath} from "@knowledge/common";
import {sFileSystem} from "./filesystem/store";

/**
 * This is nowhere near bulletproof code
 * @return
 */
function getCodeBraceExtension() {
  const CodeSymbols = {
    open: '{'.charCodeAt(0),
    close: '}'.charCodeAt(0)
  }

  const CodeDelimiter = {resolve: "CodeBrace", mark: "CodeBraceMark"}
  return {
    defineNodes: [
      {
        name: CodeDelimiter.resolve,
        style: {[`${CodeDelimiter.resolve}/...`]: tags.className},
      },
      {
        name: CodeDelimiter.mark,
        style: tags.brace
      }
    ],
      wrap: parseMixed(node => {
      return node.name === "CodeBrace" ? {parser: jsParser} : null
    }),
    parseInline: [
      {
        name: "CodeBrace",
        parse(cx, next, pos) {
          // Check for { or }
          if (next !== CodeSymbols.open && next !== CodeSymbols.close) return -1;

          // Return our delimiter, signify whether it's opening or closing, and
          // signify next position parser should continue at
          return cx.addDelimiter(CodeDelimiter, pos, pos + 1, next === CodeSymbols.open, next === CodeSymbols.close)
        }
      }
    ]
  }

}

function completeFromKDLFiles(context, sourceFile, files) {
  let tree = syntaxTree(context.state);
  let nodeBefore = tree.resolveInner(context.pos, -1)
  let from = /\./.test(nodeBefore.name) ? nodeBefore.to : nodeBefore.from
  const isImport = nodeBefore.name === 'Identifier' && nodeBefore.parent.name === "ImportDeclaration";

  const options = files.map(file => {
    let label = file.stem;
    const opt = {
      label: label,
      type: 'variable'
    }
    if (isImport) {
      opt.apply = `${label} of '${computeRelativePath(sourceFile.path, file.path)}'`
    } else {
      opt.apply = `{${label}}`
    }

    return opt;
  })

  let completion = {
    from,
    options: options,
    // validFor: /^[\w$]*$/
  };
  return completion
}

const kdlAutocomplete = (sourceFile, files) => knowledgeLanguage.data.of({
  autocomplete: (context) => completeFromKDLFiles(context, sourceFile, files)
})

/**
 * Computes autocomplete data, like relative imports from the source file specified.
 * @param {VFile} sourceFile
 * @param {VFile[]} files
 * @return {{markdown: Extension, javascript: Extension}}
 */
function getImportAutocomplete(sourceFile, files) {
  function completeFromFiles(context) {
    let tree = syntaxTree(context.state);
    let nodeBefore = tree.resolveInner(context.pos, -1)
    let from = /\./.test(nodeBefore.name) ? nodeBefore.to : nodeBefore.from
    const isImport = nodeBefore.name === 'VariableDefinition' && nodeBefore.parent.name === "ImportDeclaration";

    const options = files.map(file => {
      let label = file.stem;
      const opt = {
        label: label,
        type: 'variable'
      }
      if (isImport) {
        opt.apply = `${label} from '${computeRelativePath(sourceFile.path, file.path)}'`
      } else {
        opt.apply = `{${label}}`
      }

      return opt;
    })

    let completion = {
      from,
      options: options,
      // validFor: /^[\w$]*$/
    };
    return completion
  }

  return {
    markdown: markdownLanguage.data.of({
      autocomplete: completeFromFiles
    }),
    javascript: javascriptLanguage.data.of({
      autocomplete: completeFromFiles
    })
  }
}
const myHighlightStyle = HighlightStyle.define([
  { tag: tags.meta,
    color: "#7a757a" },
  { tag: tags.link,
    textDecoration: "underline" },
  { tag: tags.heading,
    textDecoration: "underline",
    fontWeight: "bold" },
  { tag: tags.emphasis,
    fontStyle: "italic" },
  { tag: tags.strong,
    fontWeight: "bold" },
  { tag: tags.strikethrough,
    textDecoration: "line-through" },
  { tag: tags.keyword,
    color: "#708" },
  { tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
    color: "#219" },
  { tag: [tags.literal, tags.inserted],
    color: "#164" },
  { tag: [tags.string, tags.deleted],
    color: "#a11" },
  { tag: [tags.regexp, tags.escape, /*@__PURE__*/tags.special(tags.string)],
    color: "#e40" },
  { tag: /*@__PURE__*/tags.definition(tags.variableName),
    color: "#00f" },
  { tag: /*@__PURE__*/tags.local(tags.variableName),
    color: "#30a" },
  { tag: [tags.typeName, tags.namespace],
    color: "#085" },
  { tag: tags.className,
    color: "#167" },
  { tag: [/*@__PURE__*/tags.special(tags.variableName), tags.macroName],
    color: "#256" },
  { tag: /*@__PURE__*/tags.definition(tags.propertyName),
    color: "#00c" },
  { tag: tags.comment,
    color: "#940" },
  { tag: tags.invalid,
    color: "#f00" },
  // {tag: tags.brace, color: "#f00"},
  { tag: tags.variableName, color: "#00f" },
  { tag: tags.propertyName, color: "#ad9300" },
  // {tag: t.variableName, color: "#ff9100"},
])


const _sEditor = writable({el: null, view: null, file: null,});

export const sEditor = {
  subscribe: _sEditor.subscribe,
  set: _sEditor.set,
  init: function (el) {
    this._setUpdateListener(el)
    _sEditor.update(state => ({...state, el}));
  },
  getValue: function() {
      const {view, file} = get(_sEditor);
      return view.state.toJSON().doc;
  },
  /**
   *
   * @return {VFile}
   */
  getFile: function() {
    return get(_sEditor).file;
  },
  _setUpdateListener: function (el) {
    function _listener() {
      const {view, file} = get(_sEditor);
      file.value = view.state.toJSON().doc; // Update VFile
      sFileSystem.dump(); // todo: save on every change — maybe explicit save is better (Stackblitz pattern)
    }

    el.removeEventListener('input', _listener)
    el.addEventListener('input', _listener)
  },
  /**
   *
   * @param {import('vfile').VFile} file
   */
  setFile: function (file) {
    _sEditor.update(state => {

      // Update current file before we switch
      if (state.file && state.view.state) {
        state.file.value = state.view.state.toJSON().doc
      }

      return {...state, file}
    })

    // Set editor content
    let value = file.value || '';
    this._setValue(value, file);
  },
  _setValue: function (value, file) {
    const {el, view} = get(_sEditor);
    view?.destroy();

    _sEditor.update(state => {

      let myTheme = EditorView.theme({
        "&": {
          color: "black",
          backgroundColor: "#ffffff"
        },
        ".cm-content": {
          caretColor: "#0e9",
          fontFamily: "Roboto Mono",
          fontWeight: 300
        },
        "&.cm-focused .cm-cursor": {
          borderLeftColor: "#0e9"
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
          backgroundColor: "#074"
        },
        ".ͼ7": {
          fontSize: '20px',
          textDecoration: 'none',
        },
        ".cm-content, .cm-gutter": {minHeight: "100vh"},
        ".cm-gutters": {
          display: "none",
          backgroundColor: "#045",
          color: "transparent",
          border: "none"
        }
      }, {dark: false})

      // The Markdown parser will dynamically load parsers
      // for code blocks, using @codemirror/language-data to
      // look up the appropriate dynamic import.

      let files = get(sFileSystem)


      let extensions = [
        basicSetup,
        myTheme,
        keymap.of([indentWithTab]),
      ];

      if (file.extname === '.mdl') {
        let importAutocomplete = getImportAutocomplete(file, files)
        extensions = [
          syntaxHighlighting(myHighlightStyle),
          ...extensions,
          importAutocomplete.javascript, // Autocomplete for JS (within script tag)
          importAutocomplete.markdown, // Autocomplete for markdown (works within MD-like body) // todo: does not work within curly brackets
          markdown({codeLanguages: languages, extensions: [Strikethrough, getCodeBraceExtension()]}),
          EditorView.lineWrapping,
        ]
      } else if (file.extname === '.kdl') {
        let importAutocomplete = kdlAutocomplete(file, files.filter(f => f.extname === '.kdl'))
        extensions = [
          ...extensions,
          importAutocomplete,
          knowledge(),
        ]
      }

      let editorView = new EditorView({
        doc: value,
        extensions,
        parent: el
      });

      return {
        ...state,
        view: editorView
      }
    })
  }
}

