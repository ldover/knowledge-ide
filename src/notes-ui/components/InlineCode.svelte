<script>
  export let node;
</script>

<span class="inline-code">{node.value}</span>

<style>
    .inline-code {
        @apply bg-gray-200 text-gray-900 rounded-sm text-sm px-1;
        font-family: "Roboto Mono", monospace;
    }
</style>