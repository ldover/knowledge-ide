import {writable, get} from "svelte/store";
import {getModal} from "../store";
import {VFile} from "vfile";
import {sFileSystem} from "../../store";
import {getNewFileModal} from "../new-file/store";

/**
 *
 * @return {Modal}
 */
export function getRenameModal() {
  const _sModal = getNewFileModal()

  const sModal = {
    ..._sModal,
    submit: function () {
      this.rename();
    },
    rename: function() {
      const {file, value, type} = get(_sModal);
      if (!value) throw new Error('Value invalid: ' + value)

      this.hide()
      if (file.type === 'folder') {
        sFileSystem.renameFolder(file, value)
      } else {
        sFileSystem.renameFile(file, value)
      }
    },
    configure: function(options = {}, state = { file: null, type: 'file', value: null}) {
      !options.title && (options.title = `Rename ${state.type}`);
      !state.value && (state.value = state.file.basename)
      _sModal.configure(options, state)
    }
  }

  console.log('RenameModal', sModal)
  return sModal;
}

