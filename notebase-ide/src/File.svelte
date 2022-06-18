<script>
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let file;

</script>

<a on:click={() => dispatch('click', file)} href="javascript:;"><span>{file.name}</span></a>

<style>
    span {
        padding: 0 0 0 1.5em;
        background: 0 0.1em no-repeat;
        background-size: 1em 1em;
    }
</style>
