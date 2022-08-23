<script>
  import {getContext, onMount} from 'svelte';

  export let file;

  let el;
  const {sDiff} = getContext('stores');

  onMount(() => {
    sDiff.init(el)
  })

</script>

<div class="w-full h-full" bind:this={el}>
</div>

<style lang="scss">

</style>
