<script>
  import Node from "./Node.svelte";
  import {beforeUpdate} from "svelte";
  import {Components} from "../util";

  export let node;
  export let root = false;
  let prevNode;

  const addId = (node) => node.id = Math.round(Math.random() * 100000000) + '';
  beforeUpdate(() => {
    if (prevNode === node) return;
    prevNode = node;

    // Assigns ids to each child so the Svelte know how to update when we switch between components
    node.children && node.children.map(addId);
  })

  let component = Components[node.type].component;
  let hasChildren = Components[node.type].children;
</script>

{#if hasChildren}
  <svelte:component this={component} node={node} {...$$restProps}>
    {#if Array.isArray(node.children) && node.children.length}
      {#each node.children as childNode (childNode.id)}
        <Node node={childNode}/>
      {/each}
    {/if}
  </svelte:component>
{:else}
  <svelte:component this={component} node={node} {...$$restProps}/>
{/if}

