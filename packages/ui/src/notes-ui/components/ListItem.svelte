<script>
  export let node;
</script>

<li>
    <slot></slot>
</li>

<style>
    li > ul {
        padding-left: 24px;
    }

    li > ol {
        padding-left: 24px;
    }

    li > p {
        @apply mb-0;
    }
</style>