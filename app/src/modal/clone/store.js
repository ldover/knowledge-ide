import {writable, get} from "svelte/store";
import {getModal} from "../store";

/**
 *
 * @return {Modal}
 */
export function getCloneModal(sFileSystem, sGit) {
  const _sModal = getModal({
    cloning: false,
    url: null,
  })


  return {
    ..._sModal,
    clone: async function () {
      const {url} = get(_sModal);
      if (!url) {
        throw new Error("Specify url")
      }

      try {
        if ((await sFileSystem.getFiles()).length) {
          if (!window.confirm('Git clone will overwrite your local files. To avoid losing changes you should push to remote repo. Confirm to override.')) {
            return;
          } else {
            if (!window.confirm('Confirm again to overwrite local files and clone.')) {
              return
            }
          }

          await sFileSystem.deleteFolder(sFileSystem.getWorkingDir(), false)
        }
      } catch (err) {
        console.log(err)
      }

      // todo: run all required checks: is folder path valid (empty, etc.)
      // const isEmpty = await sFileSystem.isValidDirectory(dir);

      try {
        _sModal.configure({}, {cloning: true})
        await sGit.clone(url);
        window.alert('Clone successful!')
        this.hide();
      } catch (err) {
        window.alert('Failed clone')
        console.error('Display error somewhere', err)
      } finally {
        _sModal.configure({}, {cloning: false})
      }
    },
  }
}

