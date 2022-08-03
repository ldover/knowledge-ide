import {writable, get} from "svelte/store";
import {sFileSystem} from "../store";
import {sModal} from "../modal/store";

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
  onNew: async function(type = 'file') {
    const {file} = get(_sContextMenu);
    sModal.show(file, type);
    this.hide();
  },
  onDelete: async function() {
    const {file} = get(_sContextMenu);
    this.hide();
    sFileSystem.deleteFile(file);
  },
}
