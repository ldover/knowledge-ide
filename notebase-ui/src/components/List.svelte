<script>
  export let node;

  console.log('List', node)

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

<style lang="scss">

</style>
