<script>
  import Folder from './Folder.svelte';
  import {onMount} from "svelte";
  import {sEditor, sFileSystem} from "./store";

  let root;

  onMount(async () => {
    const dir = await sFileSystem.init()
    if (dir?.files) {
      const firstFile = dir.files[0];
      sEditor.setFile(firstFile);
    }
  })

  async function onClick(e) {
    sEditor.setFile(e.detail)
  }
</script>

{#if $sFileSystem}
    <div class="flex">
        <Folder file={$sFileSystem} expanded on:click={onClick}/>
        <div class="px-3"></div>
    </div>
{/if}
