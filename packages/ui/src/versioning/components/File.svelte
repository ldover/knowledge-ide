<script>
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let file;

  export let button;
  export let onClick;
</script>

<div class="flex justify-between items-center cursor-pointer"
     on:click={() => dispatch('select', file)}
>
  <div>{file.path}</div>

  <button class="bg-gray-100 rounded-sm px-2"
          on:click|stopPropagation={() => onClick()}>{button}</button>
</div>

<style lang="scss">

</style>
