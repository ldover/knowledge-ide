<script>
  export let node;
</script>

<blockquote>
    <slot></slot>
</blockquote>

<style>
    blockquote {
        @apply m-0 border-l-2 border-gray-300 pl-3;
        @apply mb-3;
        @apply text-gray-700;
    }

    blockquote > p {
        margin: 0;
    }
</style>