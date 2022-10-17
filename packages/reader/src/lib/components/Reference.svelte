<script>
  import {getContext} from 'svelte';

  export let node;

  const sTooltip = getContext('sTooltip');
  console.log('getContext', sTooltip)

  let el;
  function onClick() {
    if (node.statement) {
      sTooltip.show(node.statement, el);
    }  else {
      window.alert('WARNING: Broken reference, see log for details')
      console.warn("Broken reference", {node});
    }
  }
</script>

<a href="javascript:;"
   bind:this={el}
   on:click={() => onClick()}
   class="reference">
  {node.title}
</a>

<style>
    .reference {
        @apply text-teal-600;
    }
</style>
