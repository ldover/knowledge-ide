<script>
  import Folder from './Folder.svelte';
  import {onMount} from "svelte";
  import {sEditor, sFileSystem, sFileTree} from "./store";

  let root;
</script>

{#if $sFileTree}
    <div class="flex">
        <Folder file={$sFileTree}
                expanded={true}/>
        <div class="px-3"></div>
    </div>
{/if}
