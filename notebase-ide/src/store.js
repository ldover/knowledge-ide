import {get, writable} from "svelte/store";
import {basicSetup, EditorView} from "codemirror";

import {markdown} from "@codemirror/lang-markdown";
import {languages} from "@codemirror/language-data";

const _sEditor = writable({el: null, view: null, file: null,});

export const sEditor = {
  subscribe: _sEditor.subscribe,
  set: _sEditor.set,
  init: (el) => {
    el.addEventListener('input', () => {
      const {view} = get(_sEditor);

      let newContent = view.state.toJSON().doc;
      console.log({view, state: view.state.toJSON()})
      // _.debounce() Method
    })

    _sEditor.update(state => ({...state, el}));
  },
  setFile: function (file) {
    if (file.content) {
      this.setValue(file.content);
    }
    _sEditor.update(state => ({...state, file}))
  },
  setValue: function (value) {
    const {el, view} = get(_sEditor);
    view?.destroy();

    _sEditor.update(state => {

      // The Markdown parser will dynamically load parsers
      // for code blocks, using @codemirror/language-data to
      // look up the appropriate dynamic import.
      let editorView = new EditorView({
        doc: value,
        extensions: [
          basicSetup,
          markdown({codeLanguages: languages})
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
  updateFile: function (file, state) {

  }
}