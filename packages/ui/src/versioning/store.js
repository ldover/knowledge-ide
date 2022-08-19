import {get, writable} from 'svelte/store';

import * as http from 'isomorphic-git/http/web';
import * as git from 'isomorphic-git'
import fs from "fs";
import {VFile} from 'vfile';
import {getModal} from "../modal/store";


const _sGit = writable([]);

export const FILE = 0, HEAD = 1, WORKDIR = 2, STAGE = 3;

export function getGit(sFileSystem) {

  const rootDir = sFileSystem.getWorkingDir();
  const fs = sFileSystem.getInstance();


  const sGit = {
    subscribe: _sGit.subscribe,
    clone: async function (dir = '/knowledge-library', url = 'https://gitlab.com/ldover/knowledge-library.git') {

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
    load: async function() {
        const gitMatrix = await git.statusMatrix({fs, dir: rootDir});

        return gitMatrix.map(row => {
          return {
            path: row[FILE],
            status: row
          }
        })
    },
    refresh: async function () {
        const gitFiles = await this.load()
        console.log('refresh', {gitFiles})
        _sGit.set(gitFiles)
    },
    init: async function () {
      await this.refresh()

      await git.setConfig({
        fs,
        dir: rootDir,
        path: 'user.name',
        value: 'ldover'
      })

      await git.setConfig({
        fs,
        dir: rootDir,
        path: 'user.email',
        value: 'luka.dover@gmail.com'
      })

      // todo: Register listeners
      // sFileSystem.on('change', () => {
      //   this.refresh(); // todo: Should throttle this
      // })
    },
    commit: async function (message) {
      console.log('commit', {message})
      await git.commit({fs, dir: rootDir, message})
      console.log('successfully committed changes')
      this.refresh();
    },
    add: async function (file) {
      console.log('git add', file)
      await git.add({fs, dir: rootDir, filepath: file.path})

      this.refresh()
    },
    remove: async function (file) {
      await git.remove({fs, dir: rootDir, filepath: file.path})

      this.refresh()
    },
    push: function () {
    },
    pull: function () {
    },
    diff: function () {
    },
    getLatest: async function (file) {
      console.log('getLatest', {file})
      const commitOid = await git.resolveRef({fs, dir: rootDir, ref: 'main'}); // Latest commit

      const relativePath = file.path.replace(rootDir + '/', '');
      console.log({relativePath})
      const content = await this._readFileFromCommit(relativePath, commitOid);
      console.log({content})
      return new VFile({path: file.path, value: content })
    },
    _readFileFromCommit: async function (filepath, oid) {
      let {blob} = await git.readBlob({
        fs,
        dir: rootDir,
        oid,
        filepath,
      });

      return new TextDecoder().decode(blob);
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

  return sGit;
}

export function getGitModal(sGit, sFileSystem) {
  const _sGitModal = getModal({
    selectedFile: null
  });

  return {
    ..._sGitModal,
    select: async function (file) {
       const selectedFile = await sFileSystem.getFile(file.path)
      _sGitModal.update(state => ({...state, selectedFile}))
    }
  }

}
