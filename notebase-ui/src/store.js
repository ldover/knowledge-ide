import {readable, writable} from "svelte/store";
import {Notes} from './notebaseJs/index';

export const sNotes = writable(Notes);

const _sNavigation = writable(null);


export const sNavigation = {
  subscribe: _sNavigation.subscribe,
  set: _sNavigation.set,
  navigate: (name) => {
    console.log('navigate', {name});
    if (!Notes[name]) return window.alert('Note not found: "' + name + '"');

    _sNavigation.set(Notes[name]);
    localStorage.setItem('lastNote', name);
  }
}

