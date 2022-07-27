<script>
  export let node;
</script>

<!-- todo: there should be a node 'Reference' with name -->
<a href="#/{node.value}"
   class="note-reference">
    {node.value}
</a>

<style>
    .note-reference {
        @apply text-teal-600;
    }
</style>