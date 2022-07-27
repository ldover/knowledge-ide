<script>
  import {createEventDispatcher} from 'svelte';
  import {sEditor} from "./store";
  import {sContextMenu} from "./context-menu/store";

  const dispatch = createEventDispatcher();

  /** @type {import('vfile').VFile} */
  export let file;

</script>

<a on:click={() => dispatch('click', file)}
   on:contextmenu|preventDefault={event => sContextMenu.addEvent(event, file)}
   class:text-red-500={file === $sEditor.file}
   class="flex items-center"
   href="javascript:;"><span class="material-symbols-sharp text-gray-400">description</span>{file.basename}
</a>

<style>
</style>
