<script>
  export let node;
</script>

{#if node.depth === 1}
    <h1><slot></slot></h1>
{:else if node.depth === 2}
    <h2><slot></slot></h2>
{:else if node.depth === 3}
    <h3><slot></slot></h3>
{:else if node.depth === 4}
    <h4><slot></slot></h4>
{:else if node.depth === 5}
    <h5><slot></slot></h5>
{/if}

<style>
    h1 {
        @apply font-medium;
        @apply text-2xl;
        @apply mb-3;
    }
    h2 {
        @apply text-xl;
        @apply mb-3;
    }
    h3 {
        @apply text-lg;
        @apply mb-3;
    }
</style>
