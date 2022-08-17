import {writable, get} from "svelte/store";
import {getModal} from "../store";
import * as http from 'isomorphic-git/http/web';
import * as git from 'isomorphic-git'


/**
 *
 * @return {Modal}
 */
export function getCloneModal(sFileSystem) {
  const _sModal = getModal({
    dir: null,
    url: null,
  })

  async function clone(dir = '/test-clone', url = 'https://gitlab.com/ldover/knowledge-library.git') {


    let fs = sFileSystem.getInstance();
    console.assert(fs);
    await git.clone({
      fs: fs,
      http,
      dir,
      url,
      corsProxy: 'https://cors.isomorphic-git.org',
      onAuth: (url) => onAuth(url)
    })
  }


  function onAuth(url) {
    const accessToken = "glpat-Mzd_iz-ysuRT5Yz6XgBV"
    const username = "ldover";

    return {
      username,
      password: accessToken
    };
  }

  return {
    ..._sModal,
    clone: async function () {
      const {dir, url} = get(_sModal);

      try {
        await clone();
      } catch (err) {
        // todo: display error in the interface
        window.alert('Failed clone')
        console.error('Display error somewhere', err)
      } finally {
      }
    },
  }
}

