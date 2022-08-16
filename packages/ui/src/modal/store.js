import {writable, get} from "svelte/store";


/**
 *
 * @return {import('../typedef').Modal}
 */
export function getModal(initialState) {
  initialState = {
    el: null,
    visible: null,
    ...initialState
  };

  const _sModal = writable(initialState)

  const sModal = {
    subscribe: _sModal.subscribe,
    set: _sModal.set,
    configure: function (options, state1 = {}) {
      _sModal.update(state => {
        return {...state, options, ...state1}
      })
    },
    reset: function () {
      _sModal.set(initialState)
    },
    show: function () {
      _sModal.update(state => {
        return {...state, visible: true}
      })
    },
    hide: function () {
      _sModal.update(state => ({...state, file: null, visible: false, value: null}))
    },
  }

  return sModal;
}

