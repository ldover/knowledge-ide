import {writable, get} from "svelte/store";
import {sFileSystem} from "../store";

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
    console.log('onNew: folder in context', file)
    if (file.type !== 'folder') {
      return window.alert('Cannot add file to file... this edge case not implemented')
    }
    if (!value) return window.alert('value invalid')
    let filepath = [file.path, value + '.mdl'].join('/');
    this.hide()
    await sFileSystem.addFile(filepath)
  }
}