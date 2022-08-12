<script>
  export let node;
  export let root = false;
</script>


<!-- todo: implement actual link href here -->
<div class="note relative">
    {#if !root}
        <a class="note-handle cursor-pointer absolute text-orange-500 text-xs font-medium">
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


