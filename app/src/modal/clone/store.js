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

