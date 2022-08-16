import {writable, get} from "svelte/store";
import {getModal} from "../store";
import * as http from 'isomorphic-git/http/web';
import * as git from 'isomorphic-git'
import LightningFS from '@isomorphic-git/lightning-fs';

const fs = new LightningFS('fs');
console.log('filesystem', {fs})

async function clone(dir = '/test-clone', url = 'https://gitlab.com/ldover/knowledge-library.git') {
  console.log('cloning', {dir, url})

  await git.clone({
    fs,
    http,
    dir,
    url,
    corsProxy: 'https://cors.isomorphic-git.org',
    onAuth: (url) => onAuth(url)
  })

  console.log('clone complete')
}


function onAuth(url) {
  console.log('onAuth', url)
  const accessToken = "glpat-Mzd_iz-ysuRT5Yz6XgBV"
  const username = "ldover";

  return {
    username,
    password: accessToken
  };
}

/**
 *
 * @return {Modal}
 */
export function getCloneModal() {
  const _sModal = getModal({
    dir: null,
    url: null,
  })

  return {
    ..._sModal,
    clone: async function () {
      const {dir, url} = get(_sModal);

      try {
        await clone();
        console.log('clone successful')
      } catch (err) {
        // todo: display error in the interface
        window.alert('Failed clone')
        console.error('Display error somewhere', err)
      } finally {
        console.log('finally')
      }
    },
  }
}

