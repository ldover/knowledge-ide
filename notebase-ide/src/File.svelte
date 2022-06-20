<script>
  import {createEventDispatcher} from 'svelte';
  import {sEditor} from "./store";
  import {sContextMenu} from "./context-menu/store";

  const dispatch = createEventDispatcher();

  export let file;

  $: console.log('File.svelte', {active: $sEditor.file, file})
</script>

<a on:click={() => dispatch('click', file)}
   on:contextmenu|preventDefault={event => sContextMenu.addEvent(event, file)}
   class:text-red-500={file.path === $sEditor.file?.path}
   href="javascript:;"><span>{file.name}</span></a>

<style>
    span {
        padding: 0 0 0 1.5em;
        background: 0 0.1em no-repeat;
        background-size: 1em 1em;
    }
</style>
