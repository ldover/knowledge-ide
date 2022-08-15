<script>
  export let node;
</script>

<li>
    <slot></slot>
</li>

<style>
    li > :global(ul) {
        padding-left: 24px;
    }

    li > :global(ol) {
        padding-left: 24px;
    }

    li > p {
        @apply mb-0;
    }
</style>
