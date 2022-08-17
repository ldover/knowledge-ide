import {get, writable} from 'svelte/store';

import * as http from 'isomorphic-git/http/web';
import * as git from 'isomorphic-git'


const _sGit = writable([]);


export function getGit(sFileSystem) {


  sFileSystem.getFiles().then(files => {
    const gitFiles = files.map(file => {
      return {
        path: file.path,
        status: 'unstaged'
      }
    })

    console.log({gitFiles});
    _sGit.set(gitFiles)
  });

  return {
    subscribe: _sGit.subscribe,
    clone: async function (dir = '/knowledge-library', url = 'https://gitlab.com/ldover/knowledge-library.git') {

      let fs = sFileSystem.getInstance();
      console.assert(fs);
      await git.clone({
        fs: fs,
        http,
        dir,
        url,
        corsProxy: 'https://cors.isomorphic-git.org',
        onAuth: (url) => this._onAuth(url)
      })

      // Refresh file system
      sFileSystem.init()
    },
    init: function () {
    }, // init from the local filesystem and cwnd
    commit: function () {
    },
    add: function (file) {
      _sGit.update(files => {
        const f = files.find(f => f === file);
        f.status = 'staged';
        return files;
      })
    },
    remove: function (file) {
      _sGit.update(files => {
        const f = files.find(f => f === file);
        f.status = 'unstaged';
        return files;
      })
    },
    push: function () {
    },
    pull: function () {
    },
    diff: function () {
    },
    _onAuth: function (url) {
      const accessToken = "glpat-Mzd_iz-ysuRT5Yz6XgBV"
      const username = "ldover";

      return {
        username,
        password: accessToken
      };
    }

  }
}
