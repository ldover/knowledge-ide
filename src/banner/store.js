import {writable} from "svelte/store";

const _banners = writable([
  {
    type: 'error',
    message: "Import 'X' not found.",
    loc: {
      line: 1,
      column: 12,
    }
  }
])
export const banners = {
  subscribe: _banners.subscribe,
  clear: function() {
     _banners.set([])
  },
  add: function(message, loc) {

    // file.message('Unexpected unknown word `braavo`, did you mean `bravo`?', {
    //   line: 1,
    //   column: 8
    // })
  }
}