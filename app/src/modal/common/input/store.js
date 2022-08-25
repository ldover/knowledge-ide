import {writable, get} from "svelte/store";
import {tick} from "svelte";

import {getModal} from "../../store";


export function getInputModal(initialState) {
  initialState = {
    inputEl: null,
    value: null,
    options: {
      title: null,
      placeholder: null,
    },
    ...initialState
  };

  const _sModal = getModal(initialState);

  return {
    ..._sModal,
    submit: function () {
      throw new Error('Not implemented: you should override \'submit\' function.')
    },
    show: function () {
      _sModal.show();

      // Wait a tick for the modal to render, then focus the input field.
      tick().then(() => {
        get(_sModal).inputEl.focus();
      })
    }
  }
}
