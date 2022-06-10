<script>
  import {Components, injectComponents} from "../util";
  import Node from "./Node.svelte";
  import {beforeUpdate} from "svelte";

  export let node;
  let prevNode;

  const addId = (node) => node.id = Math.round(Math.random() * 100000000) + '';
  beforeUpdate(() => {
    if (prevNode === node) return;

    prevNode = node;

    node.children && node.children.map(addId);
  })



  let component = Components[node.type];

  console.log({node, component})
</script>

<svelte:component this={component} node={node}>
    {#if Array.isArray(node.children)}
        {#each node.children as childNode (childNode.id)}
            <Node node={childNode}/>
        {/each}
    {/if}
</svelte:component>

