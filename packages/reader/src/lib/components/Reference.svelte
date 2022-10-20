<script>
  import {getContext} from 'svelte';

  export let node;

  const sTooltip = getContext('sTooltip');

  let el;
  function onClick() {
    if (node.statement) {
      sTooltip.show(node.statement, el);
    } else if (node.symbol) {
      sTooltip.show(node.symbol, el);
    }  else {
      window.alert('WARNING: Broken reference, see log for details')
      console.warn("Broken reference", {node});
    }
  }
</script>

<!-- todo: temporary fix — will have to generalize how to handle references -->
<a href="javascript:;"
   bind:this={el}
   on:click={() => onClick()}
   class="reference">
  {node.title}
</a>

<style>
  .symbol-reference {
    @apply text-gray-900 font-medium;
  }

  .reference {
    @apply text-teal-600;
  }

  .reference:hover {
    @apply text-teal-700 underline;
  }
</style>
