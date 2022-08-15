<script>
  export let node;
</script>

<li>
    <slot></slot>
</li>

<style>
    li > :global(ul) {
      @apply pl-8;
      @apply mb-0;
    }

    li > :global(ol) {
      @apply pl-8;
      @apply mb-0;
    }

    li > :global(p) {
        @apply mb-0;
    }
</style>
