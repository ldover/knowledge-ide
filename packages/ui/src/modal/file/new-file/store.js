import {get} from "svelte/store";
import {VFile} from "vfile";
import {getInputModal} from "../../common/input/store";

/**
 *
 * @return {Modal}
 */
export function getNewFileModal(sFileSystem) {
  const _sModal = getInputModal({
    file: null,
  })

  return {
    ..._sModal,
    submit: function () {
      this.onNew();
    },
    onNew: function() {
      const {file, value, type} = get(_sModal);
      if (file.type !== 'folder') {
        return window.alert('Cannot add file to file... this edge case not implemented')
      }
      if (!value) return window.alert('value invalid')

      let path;
      if (type === 'folder') {
        path = `${file.path}/${value}/.`;
        sFileSystem.addFolder(path); // todo: unhandled error here
      } else {
        const isMDL = value.endsWith('.mdl')
        const isKDL = value.endsWith('.kdl')

        if (!isMDL && !isKDL) {
          return window.alert('Specify one of the supported extensions: .mdl, .kdl.')
        }

        path = `${file.path}/${value}`;

        const newFile = new VFile({
          path,
          value: ''
        })

        sFileSystem.addFile(newFile)
      }

      this.hide()
    },
    configure: function(options = {}, state = { file: null, type: 'file'}) {
      !options.title && (options.title = `New ${state.type}`);
      !options.placeholder && (options.placeholder = 'Name');
      console.assert(state.file);
      console.assert(['file', 'folder'].includes(state.type), 'Type invalid: ' + state.type);
      _sModal.configure(options, state);
    },
    show: function() {
      const {file, type} = get(_sModal)
      if (!file || !type) {
        throw new Error("No config specified: call 'configure' with file and type parameters")
      }

      _sModal.show();
    }
  }
}

