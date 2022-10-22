import {writable} from 'svelte/store';


export function getTooltip() {
  const _sTooltip = writable({
    visible: false,
    node: null,
    type: null,
    el: null,
    style: null,
    mode: 'normal' // normal | codemirror
  })

  return {
    subscribe: _sTooltip.subscribe,
    setViewMode: function(mode) {
      console.log('set view mode', {mode})
      _sTooltip.update(state => {
        return {
          ...state,
          mode
        }
      })
    },
    show: function (node, type, el) {
      console.assert(el)
      console.assert(node)

      // Compute position
      // const boundingRect = el.getBoundingClientRect();
      // let style = `top: ${boundingRect.top}px;`;

      _sTooltip.update(state => {
        return {
          ...state,
          visible: true,
          type,
          node,
          el
        }
      })
    },
    hide: function () {
      _sTooltip.update(state => {
        return {
          ...state,
          type: null,
          mode: 'normal',
          visible: false,
          node: null,
          el: null,
        }
      })
    }
  }
}

export function clickOutside(node) {
  const handleClick = (event) => {
    if (!node.contains(event.target)) {
      node.dispatchEvent(new CustomEvent("outclick"));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    }
  };
}
