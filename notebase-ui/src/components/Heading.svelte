<script>
  import {injectComponents} from "../util";

  export let node;

  $: children = injectComponents(node.children);
</script>

<h1>
    {#each children as childNode}
        <svelte:component this={childNode.component} node={childNode} />
    {/each}
</h1>

<style lang="scss">
    h1 {
      font-size: 28px;
    }
</style>
