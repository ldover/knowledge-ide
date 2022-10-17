<script>
  import {clickOutside} from "./store.js";

  export let sTooltip;

</script>

{#if $sTooltip.visible}
  <div class="tooltip-opacity">
    <div class="relative w-full h-full flex items-center justify-center ">
      <button on:click={() => sTooltip.hide()}
              class="close-button ">
        ⨉
      </button>
      <div class="tooltip-statement"
           use:clickOutside
           on:outclick={() => sTooltip.hide()}
      >
        <slot>
          Missing content
        </slot>
      </div>
    </div>
  </div>
{/if}


<style>
  .close-button {
    @apply absolute top-0 right-0 m-3 text-2xl text-white;
  }
  .tooltip-opacity {
    z-index: 1;
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    left: 0;
    top: 0;
  }

  .tooltip-statement {
    @apply shadow-md;
    /*position: fixed;*/
    z-index: 1;
    width: 320px;
  }

  @media (min-width: 480px) {
    .tooltip-statement {
      width: 480px;
    }
  }

  @media (min-width:640px)  {
    .tooltip-statement {
      width: 594px;
    }
  }
</style>
