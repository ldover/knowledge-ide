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
    clone: async function (url) {

      console.assert(fs);
      await git.clone({
        fs: fs,
        http,
        dir: rootDir,
        url,
        corsProxy: 'https://cors.isomorphic-git.org',
        onAuth: (url) => this._onAuth(url)
      })

      // Refresh file system
      sFileSystem.init()
    },
    load: async function () {
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
      _sGit.set(gitFiles)
    },
    init: async function () {
      await this.refresh()

      // todo Prompt user for git config
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
    },
    commit: async function (message) {
      await git.commit({fs, dir: rootDir, message})
      console.log('successfully committed changes')
      this.refresh();
    },
    add: async function (...files) {
      console.log({files})
      let filepaths = files.map(file => file.path);
      console.log('git add', filepaths)
      await git.add({fs, dir: rootDir, filepath: filepaths})

      this.refresh()
    },
    stage: async function (...files) {
      let addToIndex = [];
      let removeFromIndex = [];
      files.forEach(file => {
        if (file.removed) {
          removeFromIndex.push(file)
        } else {
          addToIndex.push(file)
        }
      })

      console.log({addToIndex, removeFromIndex})
      addToIndex.length && await this.add(...addToIndex);
      removeFromIndex.length && await this.remove(...removeFromIndex);
    },
    remove: async function (...files) {
      for (const file of files) {
        await git.remove({fs, dir: rootDir, filepath: file.path})
      }

      this.refresh()
    },
    push: async function () {
      try {
        let pushResult = await git.push({
          fs,
          dir: rootDir,
          http,
          remote: 'origin',
          ref: 'main',
          onAuth: (url) => this._onAuth(url),
        })

        console.log(pushResult);
        window.alert('Push successful')
      } catch (err) {
        let msg = 'Push to remote failed: ' + err;
        console.error(msg)
        window.alert(msg);
      }
    },
    pull: async function () {
      try {
        let pullResult = await git.pull({
          fs,
          dir: rootDir,
          http,
          remote: 'origin',
          singleBranch: true,
          ref: 'main',
          onAuth: (url) => this._onAuth(url),
        })

        sFileSystem.init()
        this.refresh()
        console.log(pullResult);
        window.alert('Pull successful')
      } catch (err) {
        let msg = 'Pull failed: ' + err;
        console.error(msg)
        window.alert(msg);
      }

    },
    rollback: async function (...files) {
      try {
        let filepaths = files.map(file => file.path);
        await git.checkout({
          fs,
          dir: rootDir,
          force: true,
          filepaths: filepaths
        })
        this.refresh()
        sFileSystem.init();
      } catch (err) {
        console.error(err)
      }
    },
    log: async function () {
      return git.log({fs, dir: rootDir})
    },
    diff: async function (commitHash1, commitHash2) {
      const DIRECTORY_MODE = 0o40000;

      const diffs = await git.walk({
        fs,
        dir: rootDir,
        trees: [git.TREE({ref: commitHash1}), git.TREE({ref: commitHash2})],
        map: async function (filepath, [A, B]) {
          // ignore directories
          if (filepath === '.') {
            return
          }
          let aMode = A && (await A.mode())
          let bMode = B && (await B.mode())

          if (aMode === DIRECTORY_MODE || bMode === DIRECTORY_MODE) {
            return;
          }

          const vfile = new VFile({
            path: `/${filepath}`,
            data: {
              file0: '',
              file1: '',
              status: null
            }
          })


          A && (vfile.data.file0 = await A.content())
          B && (vfile.data.file1 = await B.content())

          if (A && B) {
            let aType = await A.type();
            let bType = await B.type();

            if (aType === 'tree' || bType === 'tree') {
              return
            }

            // generate ids
            const Aoid = await A.oid()
            const Boid = await B.oid()

            if (Aoid !== Boid) {
              vfile.data.status = 'modified';
            } else {
              return;
            }
          } else if (!A && !B) {
            console.warn('Unexpected case: !A && !B')
            return;
          } else if (!A) {
            vfile.data.status = 'added';
          } else if (!B) {
            vfile.data.status = 'removed'
          }

          vfile.data.file0 && (vfile.data.file0 = new TextDecoder().decode(vfile.data.file0));
          vfile.data.file1 && (vfile.data.file1 = new TextDecoder().decode(vfile.data.file1));

          return vfile;
        }
      });

      // Filter out nulls
      return diffs.filter(_ => _);
    },
    getLatest: async function (file) {
      console.log('getLatest', {file})
      const commitOid = await git.resolveRef({fs, dir: rootDir, ref: 'main'}); // Latest commit

      const relativePath = file.path.replace(rootDir + '/', '');
      console.log({relativePath})
      const content = await this._readFileFromCommit(relativePath, commitOid);
      console.log({content})
      return new VFile({path: file.path, value: content})
    },
    getCurrentBranch: () => {
      return git.currentBranch({
        fs,
        dir: rootDir,
        fullname: false
      })
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

export function getGitModal(sGit, sFileSystem, sDiff) {
  const _sGitModal = getModal({
    selectedFile: null
  });

  return {
    ..._sGitModal,
    select: async function (file) {
      let selectedFile;

      try {
        selectedFile = await sFileSystem.getFile(file.path)
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.debug('No file found in the system, assuming deleted and using empty string')
          selectedFile = new VFile({path: file.path, value: ''});
        }
      }

      _sGitModal.configure({}, {selectedFile})

      let f0 = '';
      try {
        f0 = (await sGit.getLatest(selectedFile)).value;
      } catch (err) {

        console.log(err)
      }

      sDiff.showDiff(f0, selectedFile.value, selectedFile.path)
    },
    show: function () {
      _sGitModal.show();
      sGit.refresh();
    }
  }
}
