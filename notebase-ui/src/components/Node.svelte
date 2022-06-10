<script>
  import {Components, injectComponents} from "../util";
  import Node from "./Node.svelte";

  export let node;
  let component = Components[node.type];

  console.log({node, component})
</script>

<svelte:component this={component} node={node}>
    {#if Array.isArray(node.children)}
        {#each node.children as childNode}
            <Node node={childNode}/>
        {/each}
    {/if}
</svelte:component>

