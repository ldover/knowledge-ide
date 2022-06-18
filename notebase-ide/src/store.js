import {get, writable} from "svelte/store";
import {basicSetup, EditorView} from "codemirror";

import {markdown} from "@codemirror/lang-markdown";
import {languages} from "@codemirror/language-data";

const _sEditor = writable({el: null, view: null});

export const sEditor = {
  subscribe: _sEditor.subscribe,
  set: _sEditor.set,
  setValue: function (value) {
    const {el, view} = get(_sEditor);
    view?.destroy();

    _sEditor.update(state => {

      // The Markdown parser will dynamically load parsers
      // for code blocks, using @codemirror/language-data to
      // look up the appropriate dynamic import.
      return {
        ...state,
        view: new EditorView({
          doc: value,
          extensions: [
            basicSetup,
            markdown({codeLanguages: languages})
          ],
          parent: el
        })
      }
    })
  }
}

