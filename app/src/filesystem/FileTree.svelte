<script>
  import Folder from './Folder.svelte';

  export let sFileSystem;

  let root;
</script>

{#if $sFileSystem}
  <Folder file={$sFileSystem}
          expanded={true}/>
{/if}
