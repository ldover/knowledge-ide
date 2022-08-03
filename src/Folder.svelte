<script>
  import File from './File.svelte';
  import {sContextMenu} from "./context-menu/store";

  export let expanded = false;
  export let file;

  function toggle() {
    expanded = !expanded;
  }
</script>

<div>
    <div on:contextmenu|preventDefault={event => sContextMenu.addEvent(event, file)}
         class:expanded
         class="flex items-center cursor-pointer"
         on:click={toggle}>
        <span class="material-symbols-sharp">{expanded ? 'expand_more' : 'chevron_right'}</span>
        <span class="material-symbols-sharp text-gray-600">folder</span>{file.name}
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
