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
    if (file?.content) {
      sEditor.setValue(file.content)
      sEditor.setFile(file)
    } else {
      window.alert('no content in file')
    }
  }
</script>

{#if $sFileSystem}
    <Folder file={$sFileSystem} expanded on:click={onClick}/>
{/if}
