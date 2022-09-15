<script>
  export let node;
</script>

<img src="{node.url}" alt="{node.path}" {...node.props}/>

<style>
    img {
        @apply mb-3;
    }
</style>
