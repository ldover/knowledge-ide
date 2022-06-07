<script>
  import {Components, injectComponents} from "../util";
  import Node from "./Node.svelte";

  export let node;
  let component = Components[node.type];

  // let children = injectComponents(node.children);
</script>

<svelte:component this={component} node={node}>
    {#each node.children as childNode}
        <Node node={childNode}/>
    {/each}
</svelte:component>

