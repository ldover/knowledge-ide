<script>
    import {sNavigation} from "../store";

    export let node;
</script>


<div class="note"
     on:click|stopPropagation={() => sNavigation.set(node.note)}
>
    <slot></slot>
</div>

<style>
    .note {
        @apply shadow-2xl bg-white p-3;

        max-width: 600px;
        width: 600px;
        min-width: 300px;
    }

</style>


