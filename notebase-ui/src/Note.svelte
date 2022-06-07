<script>

  import {injectComponents} from "./util";

  export let note;

  // This injects the
  $: children = injectComponents(note.children);

  $: console.log('children', {note, children})

</script>


<div class="note">
    {#each children as node}
        <svelte:component this={node.component} node={node} />
    {/each}
</div>

<style>
    .note {
        @apply border border-blue-800;
    }
</style>


