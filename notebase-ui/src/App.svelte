<script>
    import Node from "./components/Node.svelte";
    import {sNavigation, sNotes} from "./store";

    $: note = $sNavigation;

</script>

<div class="flex w-full h-full overflow-y-hidden">
<!--    <div class="sidebar flex flex-col">-->
<!--        <div class="text-gray-300 font-medium text-base">NOTES</div>-->
<!--        <nav>-->
<!--            {#each Object.keys($sNotes) as name}-->
<!--                <div>-->
<!--                    <a on:click|preventDefault={() => sNavigation.navigate(name)}-->
<!--                       href="javascript:;"-->
<!--                    >-->
<!--                        {$sNotes[name].children[0].children[0].value}-->
<!--                    </a>-->
<!--                </div>-->
<!--            {/each}-->

<!--        </nav>-->
<!--    </div>-->
    <div class="flex-grow p-10 flex justify-center overflow-y-auto">
        <div class="note-container">
            <Node node={note.render()} root={true}/>
        </div>
    </div>
</div>

<style lang="scss">
    .sidebar {
      @apply bg-gray-600 p-3;
      width: 300px;
      height: 100vh;
    }

    a {
        @apply text-teal-200;
    }

    .note-container {
      max-width: 600px;
      width: 600px;
      min-width: 300px;
    }
</style>
