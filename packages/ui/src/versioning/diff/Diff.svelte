<script>
  import {getContext, onMount} from 'svelte';

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
