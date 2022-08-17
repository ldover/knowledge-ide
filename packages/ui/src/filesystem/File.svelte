<script>
  import {createEventDispatcher, getContext} from 'svelte';

  const dispatch = createEventDispatcher();

  const {sContextMenu, sEditor} = getContext('stores');

  export let file;

  $: hidden = file.name && file.name.startsWith('.');

  const getIcon = (extname) => {
    if (['.png', 'jpg'].includes(extname)) return 'image'
    return 'description'
  }

  function handleDragStart(ev) {
    ev.dataTransfer.setData("text", file.path);
  }
</script>

{#if !hidden}
  <a
    draggable="true"
    on:dragstart={handleDragStart}
    on:contextmenu|preventDefault={event => sContextMenu.addEvent(event, file)}
    class:text-red-300={file === $sEditor.file}
    class="flex items-center"
    href="#/{file.path.replace('~/', '')}">
    <span class="material-symbols-sharp text-gray-200">
      {getIcon(file.extname)}
    </span>{file.name}
  </a>
{/if}

<style>
</style>
