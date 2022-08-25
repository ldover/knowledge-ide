<script>
  export let node;
</script>

<a href="{node.url}"
   target="_blank">
    {node.title || node.children[0].value}
</a>

<style>
    a {
        @apply text-blue-500;
    }
</style>
