import {get, writable} from 'svelte/store';


// todo: add a refresh listener to sGit for push, pull, commit, and methods that modify git tree
export function getGitLogTab(sGit, sGitModal) {

  const _sGitLogTab = writable({
    /** @type {import('isomorphic-git').ReadCommitResult[]} */
    logs: [],
    diffs: [],
    /** @type {import('isomorphic-git').ReadCommitResult} */
    selected: null,
  });
  return {
    subscribe: _sGitLogTab.subscribe,
    refresh: function () {
      sGit.log().then(res => {
        console.log('git log', res)
        _sGitLogTab.update(state => {
          return {...state, logs: res}
        });
      })
    },
    init: function () {
      this.refresh();
    },
    /** @type {import('isomorphic-git').ReadCommitResult} */
    onSelect: async function (commitRes) {
      // Update the UI first
      let commitResPrev;
      _sGitLogTab.update(state => {
        // Find previous commit
        commitResPrev = state.logs[state.logs.findIndex(r => r === commitRes) + 1]

        return {...state, selected: commitRes}
      });

      // If prev commit exists find files that changed between two commits
      if (commitResPrev) {
        let diffs = await sGit.diff(commitResPrev.oid, commitRes.oid);

        if (diffs.length) {
          _sGitLogTab.update(state => {
            return {...state, diffs}
          });
        }
      }
    }
  }
}
