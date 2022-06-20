<script>
  import File from './File.svelte';
  import {sContextMenu} from "./context-menu/store";

  export let expanded = false;
  export let file;

  function toggle() {
    expanded = !expanded;
  }
</script>

<span on:contextmenu|preventDefault={event => sContextMenu.addEvent(event)}
      class:expanded
      on:click={toggle}>{file.name}</span>

{#if expanded}
    <ul>
        {#each file.files as file}
            <li>
                {#if file.files}
                    <svelte:self file={file} on:click/>
                {:else}
                    <File file={file} on:click/>
                {/if}
            </li>
        {/each}
    </ul>
{/if}

<style>
    span {
        padding: 0 0 0 1.5em;
        background-size: 1em 1em;
        font-weight: bold;
        cursor: pointer;
    }

    .expanded {
    }

    ul {
        padding: 0.2em 0 0 0.5em;
        margin: 0 0 0 0.5em;
        list-style: none;
        border-left: 1px solid #eee;
    }

    li {
        padding: 0.2em 0;
    }
</style>
