<script>
  import Folder from './Folder.svelte';
  import {onMount} from "svelte";
  import {sEditor, sFileSystem, sFileTree} from "./store";

  let root;

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
