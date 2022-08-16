import {writable, get} from "svelte/store";

/**
 *
 * @param {NewFileModal} sNewFileModal
 * @param {RenameModal} sRenameModal
 * @param sFileSystem
 */
export function getContextMenu(sNewFileModal, sRenameModal, sFileSystem, sCloneModal) {

  const _sContextMenu = writable({
    el: null,
    visible: null,
    file: null,
    left: 0,
    top: 0,
  })

  const sContextMenu = {
    subscribe: _sContextMenu.subscribe,
    set: _sContextMenu.set,
    addEvent: function (event, file) {
      _sContextMenu.update(state => {
        state.top = event.clientY;
        state.left = event.clientX;
        state.file = file;
        state.visible = true;
        return state;
      })
    },
    hide: function () {
      _sContextMenu.update(state => ({...state, file: null, visible: false}))
    },
    onNew: async function(type = 'file') {
      const {file} = get(_sContextMenu);
      sNewFileModal.configure({}, {file, type})
      sNewFileModal.show();
      this.hide();
    },
    onClone: function() {
      sCloneModal.show();
    },
    onRename: async function() {
      const {file} = get(_sContextMenu);
      sRenameModal.configure({}, {file, type: file.type === 'folder' ? 'folder' : 'file'})
      sRenameModal.show();
      this.hide();
    },
    onDelete: async function() {
      const {file} = get(_sContextMenu);
      this.hide();
      if (file.type === 'folder') {
        if (window.confirm(`'Sure you want to delete folder "${file.name}"?`)) {
          this._deleteFolder(file)
        }
      } else {
        sFileSystem.deleteFile(file);
      }
    },
    _deleteFolder: function(folder) {
      folder.files.forEach(f => {
        if (f.type === 'folder') {
          this._deleteFolder(f)
        } else {
          sFileSystem.deleteFile(f.value)
        }
      })
    }
  }

  return sContextMenu;
}

