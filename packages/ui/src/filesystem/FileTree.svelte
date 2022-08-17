<script>
  import Folder from './Folder.svelte';

  export let sFileSystem;

  let root;
</script>

{#if $sFileSystem}
    <div class="flex">
        <Folder file={$sFileSystem}
                expanded={true}/>
        <div class="px-3"></div>
    </div>
{/if}
