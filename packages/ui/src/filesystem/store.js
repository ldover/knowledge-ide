import {get, writable} from 'svelte/store';
import {VFile} from "vfile";
import LightningFS from '@isomorphic-git/lightning-fs';

const _sFileSystem = writable(null);


export function getFileSystem(workingDir = '/test-clone') {
  const fs = new LightningFS('fs');

  return {
    /**
     * @return {LightningFS}
     */
    getInstance: () => fs,
    subscribe: _sFileSystem.subscribe,
    /*
     * @return {VFile[]}
     */
    getFiles: async function () {
      const filePaths = this.flatten()
      return Promise.all(filePaths.map(async file => {
        const filepath = file.path;
        let value = null;
        const extname = new VFile({path: filepath}).extname;
        if (!(new VFile({path: filepath}).basename)) {
          debugger
        }
        const isHidden = new VFile({path: filepath}).basename.startsWith('.');

         if (!isHidden && ['.mdl', '.kdl', '.mdl', '.md'].includes(extname)) {
          value = await fs.promises.readFile(filepath, {encoding: 'utf8'})
         }
        return new VFile({value: value, path: filepath})
      }))
    },
    getFile: async function (path) {
      let value = await fs.promises.readFile(path, {encoding: 'utf8'});
      return new VFile({value: value, path: path})
    },
    load: function () {
      const getAllFiles = async function (dirPath) {
        const dirFiles = await fs.promises.readdir(dirPath)
        const files = await Promise.all(dirFiles.map(async file => {
          let filepath = [dirPath, file].join('/');
          const stat = await fs.promises.stat(filepath)
          const vfile = new VFile({path: file});

          if (stat.type === 'dir') {
            // Don't read the empty folder
            if (vfile.basename.startsWith('.')) {
              return null;
            }
            return getAllFiles(filepath);
          } else {
            const name = vfile.basename;
            const extname = vfile.extname;
            return {
              type: 'file',
              name,
              extname,
              path: filepath,
            }
          }
        }))

        return {
          type: 'folder',
          name: new VFile({path: dirPath}).basename,
          path: dirPath,
          files: files.filter(f => f !== null) // filter out null returns (empty folders)
        }
      }

      return getAllFiles(workingDir);
    },
    init: async function () {
      try {
        const files = await this.load();
        _sFileSystem.set(files);
        return files;
      } catch (err) {
        console.error(err);
      }
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
    addFile: async function (file) {
      await fs.promises.writeFile(file.path, file.value, {encoding: 'utf8'})
      this.init();
    },
    move: async function (filePath, folder) {
      if (folder.type === 'folder') {
        await fs.promises.rename(filePath, folder.path)
        this.init(); // Refresh
      } else {
        window.alert('Invalid move operation — target must be folder')
        console.warn('Invalid move operation — target must be folder')
      }
    },
    // refresh state
    _update: function () {
      _sFileSystem.update(state => state);
    },
    /**
     *
     * @param {VFile} file
     */
    updateFile: function (file) {
      return fs.promises.writeFile(file.path, file.value, {encoding: 'utf8'})
    },
    /**
     * Basename
     * @param file
     * @param value
     */
    renameFile: async function (file, value) {
      let parts = file.path.split('/');
      parts.splice(-1, 1, value);
      const newPath = path.join(parts);
      return this.rename(file.path, newPath);
    },
    renameFolder: function (folder, value) {
      let pathParts = folder.path.split('/');
      pathParts.splice(-1, 1, value)
      const oldPath = folder.path + '/'
      const newPath = pathParts.join('/') + '/'
      return this.rename(oldPath, newPath)
    },
    rename: async function(oldPath, newPath) {
      try {
        await fs.promises.rename(file.path, newPath)
        this.init(); // Refresh
      } catch (err) {
        console.error('Rename failed', err);
      }
    },
    deleteFile: async function (file) {
      await fs.promises.unlink(file.path)
      this.init();
    },
    deleteFolder: async function (folder) {
      await fs.promises.rmdir(folder.path)
      this.init();
    }
  };
}

