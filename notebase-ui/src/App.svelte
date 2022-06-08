<script>
    import Node from "./components/Node.svelte";
    import {sNavigation} from "./store";

    $: note = $sNavigation;
</script>

<div class="p-10">
    <h1>Notebase</h1>

    <div>
        <Node node={note.render()}/>
    </div>
</div>

<style lang="scss">

</style>
