<script>
  export const node = null;
</script>

<blockquote>
    <slot></slot>
</blockquote>

<style>
    blockquote {
        @apply m-0 border-l-2 border-gray-300 pl-3;
        @apply mb-4;
        @apply text-gray-700;
    }

    blockquote > :global(p) {
        margin: 0;
    }
</style>
