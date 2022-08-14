<script>
  export let node;
  export let root;
</script>


<div class="statement relative">

  <div class="flex justify-between items-baseline">
    <div class="font-medium">Statement {node.name}</div>
    <div class=""
       class:text-orange-500={!node.proven}
       class:text-teal-500={node.proven}>
      {node.proven ? 'Proven' : 'Not proven'}
    </div>
  </div>
    <slot></slot>
</div>

<style>
  .statement {
    @apply p-3 bg-gray-100 rounded-md mb-3;
  }
    .note-handle {
        top: 0;
        right: 0;
    }

</style>


