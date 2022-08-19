<script>
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let file;

  export let button = null;
  export let onClick;
</script>

<div class="flex justify-between items-center cursor-pointer"
     on:click={() => dispatch('select', file)}
>
  <div class:text-red-500={file.removed}
       class:text-blue-500={file.modified}
       class:text-green-500={file.added}>
    {file.path}
  </div>

  {#if button}
    <button class="bg-gray-100 rounded-sm px-2"
            on:click|stopPropagation={() => onClick()}>{button}</button>
  {/if}
</div>

<style lang="scss">

</style>
