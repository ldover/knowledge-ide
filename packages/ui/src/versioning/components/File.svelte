<script>
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let file;
  export let status;
</script>

<div class="file hover:bg-gray-200 pl-2"
     on:click={() => dispatch('select', file)}
>
  <div class="font-light"
       class:text-pink-500={status === 'removed'}
       class:text-sky-500={status === 'modified'}
       class:text-emerald-500={status === 'added'}>
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
