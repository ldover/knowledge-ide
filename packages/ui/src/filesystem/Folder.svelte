<script>
  import File from './File.svelte';
  import {onMount, getContext} from "svelte";
  import {VFile} from "vfile";
  import {sFileSystem} from "./store";

  export let expanded = false;
  export let file;

  let folderEl;

  let sContextMenu = getContext('stores').sContextMenu;

  // Converts the image into a data URI
  const readImage = async (file) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        resolve(event.target.result)
      });

      reader.readAsDataURL(file);
    })
  }

  async function handleDrop (ev) {
    // Handle drop image
    if (ev.dataTransfer.files && ev.dataTransfer.files.length) {
      let fileList = ev.dataTransfer.files;

      let fileName = fileList[0].name;

      const img = await readImage(fileList[0]);

      const vfile = new VFile({
        path: [file.path, fileName].join('/'),
        value: img
      });
      sFileSystem.addFile(vfile)
    } else { // Handle drop internal file
      const file0Path = ev.dataTransfer.getData("text");
      sFileSystem.move(file0Path, file)
    }
  }

  function toggle() {
    expanded = !expanded;
  }
</script>

<div bind:this={folderEl}>
    <div on:contextmenu|preventDefault={event => sContextMenu.addEvent(event, file)}
         on:drop|preventDefault|stopPropagation={handleDrop}
         on:dragover|preventDefault|stopPropagation={() => console.log('dragover', file.path)}
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
