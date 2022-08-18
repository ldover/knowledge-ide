<script>
  import {createEventDispatcher} from 'svelte';
  import {FILE, HEAD, WORKDIR, STAGE} from "../store";

  const dispatch = createEventDispatcher();

  export let file;


  const isDeleted = row => row[HEAD] === 1 && row[WORKDIR] === 0;
  const isUnstaged = row => row[WORKDIR] !== row[STAGE];
  const isStaged = row => row[WORKDIR] === row[STAGE];
  const isModified = row => row[HEAD] === 1 && row[WORKDIR] === 2;
  const isNew = row => row[HEAD] === 0 && row[WORKDIR] === 2;
  const isAdded = row => row[HEAD] === 0 && row[WORKDIR] === 2;


  export let button;
  export let onClick;
</script>

<div class="flex justify-between items-center cursor-pointer"
     on:click={() => dispatch('select', file)}
>
  <div class:text-red-500={isDeleted(file.status)}
       class:text-blue-500={isModified(file.status)}
       class:text-green-500={isNew(file.status)}>
    {file.path}
  </div>

  <button class="bg-gray-100 rounded-sm px-2"
          on:click|stopPropagation={() => onClick()}>{button}</button>
</div>

<style lang="scss">

</style>
