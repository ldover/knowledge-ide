<script>
  export let node;

  console.log("Link", node)
</script>

<a href="{node.url}"
   target="_blank">
    {node.title || node.children[0].value}
</a>

<style lang="scss">
  a {
    @apply text-blue-500;
  }
</style>
