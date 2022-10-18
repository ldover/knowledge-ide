import {writable} from 'svelte/store';


export function getTooltip() {
  const _sTooltip = writable({
    visible: false,
    statement: null,
    el: null,
    style: null,
  })

  return {
    subscribe: _sTooltip.subscribe,
    show: function (statement, el) {
      console.assert(el)
      console.assert(statement)

      // Compute position
      // const boundingRect = el.getBoundingClientRect();
      // let style = `top: ${boundingRect.top}px;`;

      _sTooltip.update(state => {
        return {
          ...state,
          visible: true,
          statement,
          el
        }
      })
    },
    hide: function () {
      _sTooltip.update(state => {
        return {
          ...state,
          visible: false,
          statement: null,
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
