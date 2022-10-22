<script>
  import "../app.css";
  import Node from "./Node.svelte";
  import {beforeUpdate} from "svelte";
  import {Components} from "../util";
  import Tooltip from "./tooltip/Tooltip.svelte";
  import {getTooltip} from "./tooltip/store.js";
  import {setContext} from 'svelte';

  export let node;
  export let root = false;
  let prevNode;

  let sTooltip;

  if (root === true) {
    console.log('ROOT = true')
    sTooltip = getTooltip();
    console.log('setContext', sTooltip)
    setContext('sTooltip', sTooltip)
  }


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

{#if root === true}
  <Tooltip sTooltip={sTooltip}>
    {#if $sTooltip.node}
      {#if $sTooltip.mode === 'codemirror'}
        <Node node={$sTooltip.node.render({type: 'codemirror'})} isTooltip={true}/>
      {:else}
        <Node node={$sTooltip.node.render()} isTooltip={true}/>
      {/if}
    {/if}
  </Tooltip>
{/if}

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

