import {writable, get} from "svelte/store";

/**
 *
 * @return {import('../typedef').Modal}
 */
export function getModal(initialState) {
  initialState = {
    el: null,
    inputEl: null,
    visible: null,
    value: null,
    options: {
      title: null,
      placeholder: null,
    },
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
    submit: function () {
      throw new Error('Not implemented: you should override \'submit\' function.')
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

