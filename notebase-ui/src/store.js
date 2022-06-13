import {readable, writable} from "svelte/store";
import {Notes} from './notebaseJs/index';

export const sNotes = writable(Notes);

let note = Object.keys(Notes)[0]
const lastNote = localStorage.getItem('lastNote');
if (lastNote && Notes[lastNote]) {
  note = lastNote;
}

const _sNavigation = writable(Notes[note]);


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

