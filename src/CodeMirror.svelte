<script>

  import {onMount} from "svelte";
  import {sEditor, sFileSystem} from "./store";
  import {banners} from "./banner/store";
  import Banner from "./banner/Banner.svelte";

  let el;

  onMount(async () => {
    sEditor.init(el);
    const {files, file} = await sFileSystem.init()
    if (file) {
      sEditor.setFile(file);
    }
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
