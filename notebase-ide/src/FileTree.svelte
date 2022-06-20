<script>
  import Folder from './Folder.svelte';
  import {onMount} from "svelte";
  import {sEditor, sFileSystem} from "./store";

  let root;

  onMount(async () => {
    const dir = await sFileSystem.init()
    if (dir?.files) {
      const firstFile = dir.files[0];
      const firstFileFull = await sFileSystem.getFile(firstFile.path);
      sEditor.setFile(firstFileFull);
    }
  })

  async function onClick(e) {
    const file = await sFileSystem.getFile(e.detail.path)
    sEditor.setFile(file)
  }
</script>

{#if $sFileSystem}
    <Folder file={$sFileSystem} expanded on:click={onClick}/>
{/if}
