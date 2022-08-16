import {get, writable, derived} from 'svelte/store';
import {VFile} from "vfile";

const _sFileSystem = writable(null);
/**
 * Turns file system to file tree that is consumed by FileTree.svelte
 */
export const sFileTree = derived(_sFileSystem, ($f) => {
  const dir = {
    type: 'folder',
    name: '~',
    files: []
  }

  if (!$f) return dir;

  let files = $f;

  let result = [];
  let level = {
    result
  };

  files.forEach(file => {
    let parts = file.path.split('/');
    const j = parts.length;
    parts.reduce((r, name, i, a) => {
      if (!r[name]) {
        r[name] = {result: []};
        let isFile = i + 1 === j
        let obj = {
          name,
          path: parts.slice(0, i + 1).join('/'),
          type: isFile ? 'file' : 'folder',
        };
        if (isFile) {
          obj.value = file;
        } else {
          obj.files = r[name].result
        }

        r.result.push(obj)
      }

      return r[name];
    }, level)
  })

  return result[0];
})
export const sFileSystem = {
  subscribe: _sFileSystem.subscribe,
  /**
   *
   * @return {VFile[]}
   */
  getFiles: function () {
    return get(_sFileSystem)
  },
  load: function () {
    const fsString = localStorage.getItem('__kide.filesystem');
    if (fsString) {
      let fsObject = JSON.parse(fsString);
      const files = fsObject.files.map(({path, value}) => new VFile({path, value}))
      const file = fsObject.lastOpen ? files.find(f => f.path === fsObject.lastOpen) : null;

      return {
        lastOpen: file,
        files
      }
    }

    return null;
  },
  // dump: function () {
  //   const files = get(_sFileSystem)
  //   const obj = {
  //     lastOpen: sEditor.getFile().path,
  //     files: files.map(file => ({
  //       path: file.path,
  //       value: file.toString()
  //     }))
  //   };
  //   localStorage.setItem('__kide.filesystem', JSON.stringify(obj));
  // },
  init: function () {
    let files = [];
    let file = null;
    try {
      let initialState = [];

      const loaded = this.load();
      if (loaded) {
        initialState = loaded.files;
        file = loaded.lastOpen;
      }

      const vfileMock = new VFile({
        path: '~/example.txt',
        value: '# Alpha *braavo* charlie.'
      })

      if (!initialState.length) {
        initialState.push(vfileMock)
      }

      _sFileSystem.set(initialState);
      files = initialState;
    } catch (err) {
      console.error(err);
    }

    return {
      files,
      file
    };
  },
  flatten: function () {
    const dir = get(_sFileSystem);
    if (!dir) return [];

    function walk(dir) {
      return dir.files.reduce((allFiles, nextFile) => nextFile.type === 'folder' ? [...allFiles, ...walk(nextFile)] : [...allFiles, nextFile], [])
    }

    return walk(dir);
  },
  /**
   *
   * @param {import('vfile').VFile} file
   */
  addFile: function (file) {
    _sFileSystem.update(files => {
      if (!files) {
        files = []
      }

      return [...files, file]
    })

    this.dump();
  },
  move: function (filePath, folder) {
    if (folder.type === 'folder') {
      _sFileSystem.update(files => {
        const f = files.find(f => f.path === filePath);
        if (!f) throw new Error('File not found: ' + filePath);
        f.path = [folder.path, f.basename].join('/');

        return files;
      })
    } else {
      console.warn('Invalid move operation — target must be folder')
    }
  },
  // refresh state
  _update: function () {
    _sFileSystem.update(state => state);
  },
  renameFile: function (file, value) {
    file.basename = value;
    this._update();
  },
  renameFolder: function (folder, value) {
    let pathParts = folder.path.split('/');
    pathParts.splice(-1, 1, value)
    const oldPath = folder.path + '/'
    const newPath = pathParts.join('/') + '/'

    _sFileSystem.update(files => {
      files.forEach(file => file.path = file.path.replace(oldPath, newPath));
      return files;
    })
  },
  deleteFile: function (file) {
    _sFileSystem.update(files => files.filter(f => f !== file));

    this.dump();
  },
}
