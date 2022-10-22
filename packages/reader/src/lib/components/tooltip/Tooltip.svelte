<script>
  import {clickOutside} from "./store.js";

  export let sTooltip;

</script>

{#if $sTooltip.visible}
  {#if $sTooltip.type === 'statement'}
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
  {:else if $sTooltip.type === 'file'}
    <div class="tooltip-opacity">
      <div class="relative w-full h-full flex items-center justify-center ">
        <button on:click={() => sTooltip.hide()}
                class="close-button ">
          ⨉
        </button>
        <div class="tooltip-modal"
             use:clickOutside
             on:outclick={() => sTooltip.hide()}
        >
          <div class="header">
            <div class="filename">
              {$sTooltip.node.path}
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
    @apply shadow-md;
    z-index: 1;
    width: 320px;
  }

  .tooltip-statement, .tooltip-modal {
    max-height: 80vh;
  }

  .tooltip-modal {
    @apply shadow-md bg-white rounded-sm flex flex-col;
    z-index: 1;
    width: 90%;

    min-height: 60vh;
  }

  @media (min-width: 480px) {
    .tooltip-statement, .tooltip-modal {
      width: 480px;
    }
  }

  @media (min-width:640px)  {
    .tooltip-statement, .tooltip-modal {
      width: 594px;
    }
  }
</style>
