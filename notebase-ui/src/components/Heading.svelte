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

<style lang="scss">
  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 20px;
  }

  h4 {
    font-size: 16px;
  }

  h5 {
    font-size: 12px;
  }
</style>
