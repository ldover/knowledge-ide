<script>
  import File from './File.svelte';
  import {onMount, getContext} from "svelte";
  import {sFileSystem} from "./store";
  import {VFile} from "vfile";

  export let expanded = false;
  export let file;

  let folderEl;

  let sContextMenu = getContext('stores').sContextMenu;

  // Converts the image into a data URI
  const readImage = async (file) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        console.log('loaded', event, {result: event.target.result})
        resolve(event.target.result)
      });

      reader.readAsDataURL(file);
    })
  }

  onMount(() => {
    // Event listener for dragging the image over the div
    folderEl.addEventListener('dragover', (event) => {
      event.stopPropagation();
      event.preventDefault();
      // Style the drag-and-drop as a "copy file" operation.
      event.dataTransfer.dropEffect = 'copy';
    });

    // Event listener for dropping the image inside the div
    folderEl.addEventListener('drop', async (event) => {
      event.stopPropagation();
      event.preventDefault();
      let fileList = event.dataTransfer.files;

      let fileName = fileList[0].name;
      console.log('dropping', {fileName})

      const img = await readImage(fileList[0]);

      const vfile = new VFile({
        path: [file.path, fileName].join('/'),
        value: img
      });
      console.log('created vfile', {vfile})
      sFileSystem.addFile(vfile)
    })
  })

  function toggle() {
    expanded = !expanded;
  }
</script>

<div bind:this={folderEl}>
    <div on:contextmenu|preventDefault={event => sContextMenu.addEvent(event, file)}
         class:expanded
         class="flex items-center cursor-pointer"
         on:click={toggle}>
        <span class="material-symbols-sharp">{expanded ? 'expand_more' : 'chevron_right'}</span>
        <span class="material-symbols-sharp text-teal-200">folder</span>{file.name}
    </div>
    {#if expanded}
        <ul class=ml-6>
            {#each file.files as file}
                <li>
                    {#if file.files}
                        <svelte:self file={file}/>
                    {:else}
                        <File file={file.value}/>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</div>



<style>
    .expanded {
    }

    ul {
        list-style: none;
    }
</style>
