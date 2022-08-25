import {writable, get} from "svelte/store";
import {tick} from "svelte";

import {getModal} from "../../store";


export function getMultipleInputModal(inputs, options) {
  const inputDefaults = {
    el: null,
    value: null,
    label: null,
    placeholder: null,
  };

  const optionsDefaults = {
    title: null,
    submitText: 'Submit',
  }

  const processInput = (input) => {
    return {
      ...inputDefaults,
      ...input,
    }
  }

  let initialState = {
    options: {
      ...optionsDefaults,
      ...options
    },
    inputs: inputs.map(processInput),
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
        get(_sModal).inputs[0].el.focus();
      })
    }
  }
}
