import {derived, get, writable} from "svelte/store";
import {basicSetup, EditorView} from "codemirror";
import {markdown, markdownLanguage} from "@codemirror/lang-markdown";
import {languages} from "@codemirror/language-data";
import {indentWithTab} from "@codemirror/commands"
import {keymap} from "@codemirror/view"
import {Strikethrough} from "@lezer/markdown";
import {VFile} from 'vfile'

import {syntaxTree} from "@codemirror/language"
import {javascriptLanguage} from "@codemirror/lang-javascript"
import {tags as t} from "@lezer/highlight";

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
        style: {[`${CodeDelimiter.resolve}/...`]: t.className},
      },
      {
        name: CodeDelimiter.mark,
        style: t.brace
      }
    ],
    // wrap: wrap,
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

function getImportAutocomplete(files) {
  function completeFromFiles(context) {
    let tree = syntaxTree(context.state);
    let nodeBefore = tree.resolveInner(context.pos, -1)
    let from = /\./.test(nodeBefore.name) ? nodeBefore.to : nodeBefore.from
    const isImport = nodeBefore.name === 'VariableDefinition' && nodeBefore.parent.name === "ImportGroup";

    const options = files.map(file => {
      let label = file.basename.split('.')[0];
      const opt = {
        label: label,
        type: 'variable'
      }
      if (isImport) {
        opt.apply = `${label}} from './unimplemented (todo)'`
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
    this._setValue(value);
  },
  _setValue: function (value) {
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
        ".ͼj": {
          color: '#CD5654',
          fontWeight: '400',
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

      console.log({myTheme})
      // The Markdown parser will dynamically load parsers
      // for code blocks, using @codemirror/language-data to
      // look up the appropriate dynamic import.

      let files = get(sFileSystem)

      let importAutocomplete = getImportAutocomplete(files)

      let editorView = new EditorView({
        doc: value,
        extensions: [
          basicSetup,
          myTheme,
          keymap.of([indentWithTab]),
          importAutocomplete.javascript, // Autocomplete for JS (within script tag)
          importAutocomplete.markdown, // Autocomplete for markdown (works within MD-like body) // todo: does not work within curly brackets
          EditorView.lineWrapping,
          markdown({codeLanguages: languages, extensions: [Strikethrough, getCodeBraceExtension()]}),
        ],
        parent: el
      });

      return {
        ...state,
        view: editorView
      }
    })
  }
}

const _sFileSystem = writable(null);
/**
 * Turns file system to file tree that is consumed by FileTree.svelte
 */
export const sFileTree = derived(_sFileSystem, ($f) => {
  const dir = {
    type: 'folder',
    name: '~',
    files: []
  }

  if (!$f) return dir;

  let files = $f;

  let result = [];
  let level = {
    result
  };

  files.forEach(file => {
    let parts = file.path.split('/');
    const j = parts.length;
    parts.reduce((r, name, i, a) => {
      if(!r[name]) {
        r[name] = {result: []};
        let isFile = i + 1 === j
        let obj = {
          name,
          path: parts.slice(0, i + 1).join('/'),
          type: isFile ? 'file' : 'folder',
        };
        if (isFile) {
          obj.value = file;
        } else {
          obj.files = r[name].result
        }

        r.result.push(obj)
      }

      return r[name];
    }, level)
  })

  return result[0];
})

export const sFileSystem = {
  subscribe: _sFileSystem.subscribe,
  /**
   *
   * @return {VFile[]}
   */
  getFiles: function() {
    return get(_sFileSystem)
  },
  load: function() {
      const fsString = localStorage.getItem('__kide.filesystem');
      if (fsString) {
        let fsObject = JSON.parse(fsString);
        const files = fsObject.files.map(({path, value}) => new VFile({path, value}))
        const file = fsObject.lastOpen ? files.find(f => f.path === fsObject.lastOpen) : null;

        return {
          lastOpen: file,
          files
        }
      }

      return null;
  },
  dump: function() {
    const files = get(_sFileSystem)
    const obj = {
      lastOpen: sEditor.getFile().path,
      files: files.map(file => ({
        path: file.path,
        value: file.toString()
      }))
    };
    localStorage.setItem('__kide.filesystem', JSON.stringify(obj));
  },
  init: function () {
    let files = [];
    let file = null;
    try {
      let initialState = [];

      const loaded = this.load();
      if (loaded) {
        initialState = loaded.files;
        file = loaded.lastOpen;
      }

      const vfileMock = new VFile({
        path: '~/example.txt',
        value: '# Alpha *braavo* charlie.'
      })

      if (!initialState.length) {
        initialState.push(vfileMock)
      }

      _sFileSystem.set(initialState);
      files = initialState;
    } catch (err) {
      console.error(err);
    }

    return {
      files,
      file
    };
  },
  flatten: function () {
    const dir = get(_sFileSystem);
    if (!dir) return [];

    function walk(dir) {
      return dir.files.reduce((allFiles, nextFile) => nextFile.type === 'folder' ? [...allFiles, ...walk(nextFile)] : [...allFiles, nextFile], [])
    }

    return walk(dir);
  },
  /**
   *
   * @param {import('vfile').VFile} file
   */
  addFile: function (file) {
    _sFileSystem.update(files => {
      if (!files) {
        files = []
      }

      return [...files, file]
    })

    this.dump();
  },
  deleteFile: function (file) {
    _sFileSystem.update(files => files.filter(f => f !== file));

    this.dump();
  },
  updateFile: async function (file, state) {
    console.warn('not implemented')
    // todo: implement
  },

}
