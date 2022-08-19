<script>
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let file;
</script>

<div class="file hover:bg-gray-200 pl-2"
     on:click={() => dispatch('select', file)}
>
  <div class="font-light"
       class:text-pink-500={file.removed}
       class:text-sky-500={file.modified}
       class:text-emerald-500={file.added}>
    {file.path}
  </div>
  <slot></slot>
</div>

<style lang="scss">
  .file {
    @apply flex justify-between items-center cursor-pointer;
  }

  .file > :global(button) {
    visibility: hidden;
  }
  .file:hover > :global(button) {
    visibility: visible;
  }

</style>
