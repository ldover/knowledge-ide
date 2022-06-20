import {writable, get} from "svelte/store";
import {sFileSystem} from "../store";

const _sContextMenu = writable({
  el: null,
  visible: null,
  file: null,
  left: 0,
  top: 0,
})

export const sContextMenu = {
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
  onNew: async function() {
    const {file} = get(_sContextMenu);
    console.log('onNew: folder in context', file)
    if (file.type !== 'folder') {
      return window.alert('Cannot add file to file... this edge case not implemented')
    }
    let filepath = [file.path, `NewFile${Math.round(Math.random() * 10000)}.mdl`].join('/');
    this.hide()
    await sFileSystem.addFile(filepath)
  }
}