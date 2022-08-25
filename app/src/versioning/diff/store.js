import {get, writable} from 'svelte/store';

import {Diff2HtmlUI} from 'diff2html/lib/ui/js/diff2html-ui'
import * as Diff from 'diff'

export function getGitDiff() {
  const configuration = {drawFileList: false, matching: 'lines'};

  const _sDiff = writable({
    el: null,
    filepath: null,
    file0: null,
    file1: null,
  });

  return {
    subscribe: _sDiff.subscribe,
    init: (el) => {
      _sDiff.update(state => ({...state, el}));

    },
    showDiff: (file0 , file1, filepath) => {
      _sDiff.update(state => ({...state, file0, file1, filepath}))
      const el = get(_sDiff).el;
      // Creates a unified diff patch.
      const patch = Diff.createTwoFilesPatch(filepath, filepath, file0, file1);

      const diff2htmlUi = new Diff2HtmlUI(el, patch, configuration);
      diff2htmlUi.draw();
    }
  }
}
