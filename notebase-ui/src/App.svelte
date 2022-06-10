<script>
    import Node from "./components/Node.svelte";
    import {sNavigation, sNotes} from "./store";

    $: note = $sNavigation;

</script>

<div class="flex w-full h-full">
    <div class="sidebar flex flex-col">
        <nav>
            {#each Object.keys($sNotes) as name}
                <div>
                    <a on:click|preventDefault={() => sNavigation.navigate(name)}
                       href="javascript:;"
                    >
                        {$sNotes[name].children[0].children[0].value}
                    </a>
                </div>
            {/each}

        </nav>
    </div>
    <div class="flex-grow p-10 flex justify-center">
        <Node node={note.render()}/>
    </div>
</div>

<style lang="scss">
    .sidebar {
      @apply bg-gray-600 p-3;
      height: 100vw;
    }

    a {
        @apply text-teal-200;
    }
</style>
