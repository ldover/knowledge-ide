import {writable, get} from "svelte/store";
import {getModal} from "../store";

/**
 *
 * @return {Modal}
 */
export function getCloneModal(sFileSystem, sGit) {
  const _sModal = getModal({
    dir: null,
    url: null,
  })


  return {
    ..._sModal,
    clone: async function () {
      const {dir, url} = get(_sModal);
      if (!dir || !url) {
        console.error()
        throw new Error("Specify dir and url")
      }

      // todo: run all required checks: is folder path valid (empty, etc.)
      // const isEmpty = await sFileSystem.isValidDirectory(dir);

      try {
        await sGit.clone(dir, url);
      } catch (err) {
        window.alert('Failed clone')
        console.error('Display error somewhere', err)
      }
    },
  }
}

