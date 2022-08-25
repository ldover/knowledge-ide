import {writable} from "svelte/store";

/*
Example data structure
{
  type: 'error',
  message: "Import 'X' not found.",
  loc: {
    line: 1,
    column: 12,
  }
}
 */

const _banners = writable([])
export const banners = {
  subscribe: _banners.subscribe,
  clear: function() {
     _banners.set([])
  },
  add: function(type, message, loc = null) {
    _banners.update(state => [...state, {type, message, loc}])
    // file.message('Unexpected unknown word `braavo`, did you mean `bravo`?', {
    //   line: 1,
    //   column: 8
    // })
  }
}