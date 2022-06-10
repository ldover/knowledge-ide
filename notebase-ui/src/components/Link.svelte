<script>
  export let node;
</script>

<a href="{node.url}"
   target="_blank">
    {node.title || node.children[0].value}
</a>

