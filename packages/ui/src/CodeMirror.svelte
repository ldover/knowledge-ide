<script>

  import {onMount} from "svelte";
  import {sEditor, sFileSystem} from "./store";
  import {banners} from "./banner/store";
  import Banner from "./banner/Banner.svelte";

  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  let el;

  onMount(() => {
    dispatch('mount', el)
  })


</script>

<div class="h-full relative">
  <div bind:this={el}
       class="h-full"
  >

  </div>
  <div class="absolute bottom-0 left-0 w-full">
    {#each $banners as banner}
      <Banner {banner}/>
    {/each}
  </div>
</div>

<style lang="scss">

</style>
