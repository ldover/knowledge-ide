<script>
  import Folder from './Folder.svelte';
  import {getFileTree} from "./store";

  export let sFileSystem;

  let sFileTree = getFileTree(sFileSystem);
  let root;
</script>

{#if $sFileTree}
    <div class="flex">
        <Folder file={$sFileTree}
                expanded={true}/>
        <div class="px-3"></div>
    </div>
{/if}
