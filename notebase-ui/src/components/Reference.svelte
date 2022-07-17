<script>
  export let node;
  console.log('Reference', {node});
</script>

<a href="#/{node.value.title}"
   class="reference">
    {node.value.title}
</a>

