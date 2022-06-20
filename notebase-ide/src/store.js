import {get, writable} from "svelte/store";
import {basicSetup, EditorView} from "codemirror";
import * as _ from 'lodash';
import {markdown} from "@codemirror/lang-markdown";
import {languages} from "@codemirror/language-data";

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