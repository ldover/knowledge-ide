import {writable, get} from "svelte/store";
import {sFileSystem} from "../store";
import {VFile} from "vfile";

const _sModal = writable({
  el: null,
  inputEl: null,
  visible: null,
  file: null,
  value: null,
})

export const sModal = {
  subscribe: _sModal.subscribe,
  set: _sModal.set,
  show: function (file, type) {
    _sModal.update(state => {
      state.inputEl?.focus();
      return {...state, file: file, type: type, visible: true}
    })

  },
  hide: function () {
    _sModal.update(state => ({...state, file: null, visible: false, value: null}))
  },
  onNew: async function() {
    const {file, value, type} = get(_sModal);
    if (file.type !== 'folder') {
      return window.alert('Cannot add file to file... this edge case not implemented')
    }
    if (!value) return window.alert('value invalid')

    let path;
    if (type === 'folder') {
      // Creates an empty file which allows us to display a folder (see derived store of sFileSystem)
      path = `${file.path}/${value}/.`;
    } else {
      const isMDL = value.endsWith('.mdl')
      const isKDL = value.endsWith('.kdl')

      if (!isMDL && !isKDL) {
        return window.alert('Specify one of the supported extensions: .mdl, .kdl.')
      }

      path = `${file.path}/${value}`;
    }

    const newFile = new VFile({
      path,
      value: ''
    })
    this.hide()
    sFileSystem.addFile(newFile)
  }
}
