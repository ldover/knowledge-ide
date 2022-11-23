<script>
  import Proof from "./Proof.svelte";
  import {getContext} from "svelte";

  export let node;
  export let isProof = false;
  export let isTooltip = false;

  const isDev = getContext('isDev')

  let expandProof;

  function onProof(ev) {
    if (node.proven) {
      expandProof = !expandProof;
    }
  }

  console.log('Statement', node)
</script>


<div class="statement relative border border-black"
     class:isTooltip>

  <div class="statement-header flex justify-between items-center"
       class:isDev>
    <div class="roboto-mono font-light">
      {`${node.statement?.root.symbol.name}:${node.name}`}
    </div>

    <!-- Show only in dev mode -->
    {#if isDev && !isProof && node.proven}
      <div on:click={onProof}
           class="flex">
        <span class="cursor-pointer material-symbols-sharp text-teal-500">verified</span>
      </div>
    {/if}
  </div>
  <div class="statement-body">
    <slot></slot>
  </div>

  {#if expandProof}
    <div class="w-full mt-3">
      <Proof node={node.statement.proof.render()} />
    </div>
  {/if}
</div>

<style>
  .roboto-mono {
    font-family: 'Roboto Mono', monospace;
  }

  a {
    @apply text-gray-300 font-light;
  }

  .statement-header {
    @apply px-3 py-1 w-full bg-black text-white flex justify-between font-medium;
  }

  .statement-header.isDev {
    @apply bg-gray-100 text-gray-900 font-bold;
  }

  .statement-body {
    @apply p-3 bg-white;
  }

  .statement {
    @apply mb-4;
  }

  .statement.isTooltip {
    @apply mb-0;
  }
</style>


