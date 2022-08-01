<script>
  export let node;
  export let root;
</script>


<!-- TODO: implement actual link here -->
<div class="statement relative">
    {#if !root}
        <a class="note-handle cursor-pointer absolute text-orange-500 text-xs font-medium">
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


