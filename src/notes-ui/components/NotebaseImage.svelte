<script>
  export let node;
</script>

<img src="{node.url}" alt="{node.title}" {...node.props}/>

<style>
    img {
        @apply mb-3;
    }
</style>