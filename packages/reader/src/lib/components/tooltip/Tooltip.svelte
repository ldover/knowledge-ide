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
        <div class="header">
          <div class="filename">
              {$sTooltip.node.path || $sTooltip.node.root.path}
          </div>
          {#if $sTooltip.mode === 'codemirror'}
            <button class="view-code-button" on:click={() => sTooltip.setViewMode('normal')}>
              Back
            </button>
          {:else}
            <button class="view-code-button" on:click={() => sTooltip.setViewMode('codemirror')}>
              View Code
            </button>
            {/if}
        </div>
        <div class="content">
          <slot>
            Missing content
          </slot>
        </div>
      </div>
    </div>
  </div>
{/if}


<style>
  .close-button {
    @apply absolute top-0 right-0 m-3 text-2xl text-white;
  }

  .header {
    @apply bg-black py-2 px-4 flex justify-between text-white items-center;
  }

  .filename {
    @apply text-gray-200 font-light italic text-sm;

  }

  .content {
    @apply flex-grow p-4  overflow-y-auto;
  }

  .view-code-button {
    @apply text-gray-100;
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
    @apply shadow-md bg-white rounded-sm flex flex-col;
    /*position: fixed;*/
    z-index: 1;
    width: 320px;

    min-height: 60vh;
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
