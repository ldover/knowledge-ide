<script>
  import {clickOutside} from "./store.js";

  export let sTooltip;

</script>

{#if $sTooltip.visible}
  <div class="tooltip-statement"
       use:clickOutside
       on:outclick={() => sTooltip.hide()}
       style="{$sTooltip.style}"
  >
    <slot>
      Missing content
    </slot>
  </div>
{/if}


<style>
  .tooltip-statement {
    position: fixed;
    z-index: 1;
    width: 320px;
  }

  @media (min-width: 480px) {
    .tooltip-statement {
      width: 480px
    }
  }

  @media (min-width: 920px) {
    .tooltip-statement {
      width: 600px
    }
  }
</style>
