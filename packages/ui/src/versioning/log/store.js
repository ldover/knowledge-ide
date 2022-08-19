import {get, writable} from 'svelte/store';


export function getGitLogTab(sGit, sGitModal) {

  const _sGitLogTab = writable([]);
  return {
    subscribe: _sGitLogTab.subscribe,
    refresh: function () {
      sGit.log().then(res => {
        console.log('git log', res)
        _sGitLogTab.set(res);
      })
    },
    init: function () {
      this.refresh();
    }
  }
}
