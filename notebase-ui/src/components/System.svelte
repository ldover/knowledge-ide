<script>
  import {sNavigation, sNotes} from "../store";

  export let node;
  export let root = false;
</script>


<div class="note relative">
    {#if !root}
        <a class="note-handle cursor-pointer absolute text-orange-500 text-xs font-medium"
           on:click|stopPropagation={() => sNavigation.set(node.system)}
        >
            {node.system.title} →
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


