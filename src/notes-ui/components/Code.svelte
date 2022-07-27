<script>
  export let node;
</script>

<pre><code>{node.value}</code></pre>

<style>
    pre {
        @apply mb-3;
        @apply p-2 bg-gray-100 overflow-x-auto rounded-sm;

    }

    code {
        @apply text-sm;
        @apply bg-gray-100 font-mono p-2 text-gray-700 rounded-sm;
        font-family: 'Roboto Mono', monospace;

    }
</style>