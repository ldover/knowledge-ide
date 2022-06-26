import {get, writable} from "svelte/store";
import {basicSetup, EditorView} from "codemirror";
import {markdown, markdownLanguage} from "@codemirror/lang-markdown";
import {languages} from "@codemirror/language-data";
import {indentWithTab} from "@codemirror/commands"
import {keymap} from "@codemirror/view"
import {Strikethrough} from "@lezer/markdown";

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
      let label = file.name.split('.')[0];
      const opt = {
        label: label,
        type: 'variable'
      }
      if (isImport) {
        opt.apply = `${label}} from './${file.relativePath}'`
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
    console.log({completion})
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
  _setUpdateListener: function (el) {
    function _listener() {
      const {view, file} = get(_sEditor);

      let newContent = view.state.toJSON().doc;
      sFileSystem.updateFile(file, newContent)
    }

    // let listener = _.debounce(_listener, 500);

    el.addEventListener('input', _listener)
  },
  setFile: function (file) {
    _sEditor.update(state => {

      // Update current file before we switch
      // if (state.file) {
      //   sFileSystem.updateFile(file, state.view.state.toJSON().doc)
      // }
      return {...state, file}
    })

    // Set editor content
    let value = file.content || '';
    console.log('setFile', {file, value})
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

      let files = sFileSystem.flatten();
      console.log('allfiles', {files});


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

      console.log({editorView})
      return {
        ...state,
        view: editorView
      }
    })
  }
}

const _sFileSystem = writable(null);
export const sFileSystem = {
  subscribe: _sFileSystem.subscribe,
  init: async function () {
    try {
      const dir = await fetch('http://localhost:8080')
        .then(async (response) => {
          if (!response.ok) {
            let responseJson = await response.json();
            throw responseJson.error;
          }
          return response;
        })
        .then((res) => res.json());

      console.log('fileTree.svelte', dir);
      _sFileSystem.set(dir);
      return dir;
    } catch (err) {
      console.error(err);
    }
  },
  flatten: function () {
    const dir = get(_sFileSystem);
    if (!dir) return [];

    function walk(dir) {
      return dir.files.reduce((allFiles, nextFile) => nextFile.type === 'folder' ? [...allFiles, ...walk(nextFile)] : [...allFiles, nextFile], [])
    }

    return walk(dir);
  },
  getFile: async function (path) {
    try {
      const file = await fetch('http://localhost:8080/file/' + encodeURIComponent(path))
        .then(async (response) => {
          if (!response.ok) {
            let responseJson = await response.json();
            throw responseJson.error;
          }
          return response;
        })
        .then((res) => res.json());

      return file
    } catch (err) {
      console.error(err);
    }

  },
  addFile: async function (filepath) {
    console.log('addFile called with', {filepath})
    try {
      let bodyOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filepath,
        })
      };
      const response = await fetch('http://localhost:8080/add-file/' + encodeURIComponent(filepath), bodyOptions)
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          this.init(); // todo: just insert file so we don't have to do another fetch
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      return response
    } catch (err) {
      console.error(err);
    }

  },
  deleteFile: async function (file) {
    console.log('updateFile called with', {file})
    try {
      let bodyOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      console.log({bodyOptions})
      const response = await fetch('http://localhost:8080/file/' + encodeURIComponent(file.path), bodyOptions)
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          this.init(); // todo: just insert file so we don't have to do another fetch
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      return response
    } catch (err) {
      console.error(err);
    }
  },
  updateFile: async function (file, state) {
    console.log('updateFile called with', {file, state})
    try {
      let bodyOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file,
          content: state
        })
      };

      console.log({bodyOptions})
      const response = await fetch('http://localhost:8080/file/' + encodeURIComponent(file.path), bodyOptions)
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      return response
    } catch (err) {
      console.error(err);
    }
  },

}