import {writable, get} from "svelte/store";
import {sFileSystem} from "../store";
import {VFile} from "vfile";

const _sModal = writable({
  el: null,
  visible: null,
  file: null,
  value: null,
})

export const sModal = {
  subscribe: _sModal.subscribe,
  set: _sModal.set,
  show: function (file) {
    _sModal.update(state => ({...state, file: file, visible: true}))
  },
  hide: function () {
    _sModal.update(state => ({...state, file: null, visible: false, value: null}))
  },
  onNew: async function() {
    const {file, value} = get(_sModal);
    if (file.type !== 'folder') {
      return window.alert('Cannot add file to file... this edge case not implemented')
    }
    if (!value) return window.alert('value invalid')

    const isMDL = value.endsWith('.mdl')
    const isKDL = value.endsWith('.kdl')

    if (!isMDL && !isKDL) {
      return window.alert('Specify one of the supported extensions: .mdl, .kdl.')
    }

    const newFile = new VFile({
      type: isMDL ? 'mdl' : 'kdl',
      path: `${file.path}/${value}`,
      value: ''
    })
    this.hide()
    sFileSystem.addFile(newFile)
  }
}