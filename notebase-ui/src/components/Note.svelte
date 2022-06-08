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
        @apply border border-blue-800 cursor-pointer;
    }
</style>


