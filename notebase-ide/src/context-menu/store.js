import {writable} from "svelte/store";

const _sContextMenu = writable({
  el: null,
  visible: null,
  left: 0,
  top: 0,
})

export const sContextMenu = {
  subscribe: _sContextMenu.subscribe,
  set: _sContextMenu.set,
  addEvent: function (event) {
    _sContextMenu.update(state => {
      state.top = event.clientY;
      state.left = event.clientX;
      state.visible = true;
      return state;
    })
  },
  hide: function () {
    _sContextMenu.update(state => ({...state, visible: false}))
  }
}