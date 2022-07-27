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

    node.children && node.children.map(addId);
  })



  let component = Components[node.type];

  $: console.log(node.type, {node})
</script>

<svelte:component this={component} node={node} root={root}>
    {#if Array.isArray(node.children)}
        {#each node.children as childNode (childNode.id)}
            <Node node={childNode}/>
        {/each}
    {/if}
</svelte:component>

