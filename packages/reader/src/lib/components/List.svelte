<script>
  export let node;

</script>

{#if node.ordered}
    <ol>
        <slot></slot>
    </ol>
{:else}
    <ul>
        <slot></slot>
    </ul>
{/if}

<style>
    ul {
        list-style-type: var(--list-style);
    }

    ol {
        list-style: decimal;
    }

    ol, ul {
        @apply mb-4;
    }
</style>
