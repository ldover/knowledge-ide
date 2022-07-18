<script>
  import {sNavigation} from "../store";

  export let node;
  export let root;

  console.log('Statement', {node})
</script>


<!-- TODO: consider adding a link to navigate to the statement and examine backlinks -->
<div class="statement relative">
    {#if !root}
        <a class="note-handle cursor-pointer absolute text-orange-500 text-xs font-medium"
           on:click|stopPropagation={() => sNavigation.set(node.statement)}
        >
            {node.statement.title} →
        </a>
    {/if}
    <slot></slot>
</div>

<style>
    .note-handle {
        top: 0;
        right: 0;
    }

</style>


