<script>
    import {injectComponents} from "../util";

    export let node;

    $: children = injectComponents(node.children);
</script>

<p>
    {#each children as childNode}
        <svelte:component this={childNode.component} node={childNode} />
    {/each}
</p>

<style lang="scss">

</style>
