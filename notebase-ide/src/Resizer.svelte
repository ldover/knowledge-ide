<script>
  import {onMount} from "svelte";

  /**
   *
   * @param {HTMLElement} eResizer
   */
  function init(eResizer) {
    // Query the element
    const leftSide = eResizer.previousElementSibling;
    const rightSide = eResizer.nextElementSibling;

// The current position of mouse
    let x = 0;
    let y = 0;

// Width of left side
    let leftWidth = 0;

    const mouseMoveHandler = function (e) {
      // How far the mouse has been moved
      const dx = e.clientX - x;
      const dy = e.clientY - y;

      const newLeftWidth = ((leftWidth + dx) * 100) / eResizer.parentNode.getBoundingClientRect().width;
      leftSide.style.width = `${newLeftWidth}%`;
    };

// Handle the mousedown event
// that's triggered when user drags the eResizer
    const mouseDownHandler = function (e) {
      // Get the current mouse position
      x = e.clientX;
      y = e.clientY;
      leftWidth = leftSide.getBoundingClientRect().width;

      // Attach the listeners to `document`
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseUpHandler = function () {
      eResizer.style.removeProperty('cursor');
      document.body.style.removeProperty('cursor');

      leftSide.style.removeProperty('user-select');
      leftSide.style.removeProperty('pointer-events');

      rightSide.style.removeProperty('user-select');
      rightSide.style.removeProperty('pointer-events');

      // Remove the handlers of `mousemove` and `mouseup`
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

// Attach the handler
    eResizer.addEventListener('mousedown', mouseDownHandler);
  }

  let eResizer;
  onMount(() => init(eResizer))
</script>

<div class="resizer w-1 h-full"
     bind:this={eResizer}></div>

<style lang="scss">
  .resizer {
    cursor: col-resize;
    background: black;
    height: 100vw;
  }
</style>
