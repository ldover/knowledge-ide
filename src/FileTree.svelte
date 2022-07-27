<script>
  import Folder from './Folder.svelte';
  import {onMount} from "svelte";
  import {sEditor, sFileSystem, sFileTree} from "./store";

  let root;

  onMount(async () => {
    // todo: I don't like this implicit logic of returning files and active file and then loading up editor here
    // Optimally CodeMirror.svelte looks up the filesystem store and loads itself up
    const {files, file} = await sFileSystem.init()
    if (file) {
      sEditor.setFile(file);
    }
  })

  async function onClick(e) {
    sEditor.setFile(e.detail)
  }
</script>

{#if $sFileTree}
    <div class="flex">
        <Folder file={$sFileTree} expanded on:click={onClick}/>
        <div class="px-3"></div>
    </div>
{/if}
