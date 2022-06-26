<script>
    import Node from "./components/Node.svelte";
    import {sNavigation, sNotes} from "./store";
    import {Notes} from "./notebaseJs";
    import {onMount} from "svelte";

    $: note = $sNavigation;


    const noteFromHash = (hash) => hash.slice(2);

    let name = noteFromHash(window.location.hash)
    if (name) {
      sNavigation.navigate(name);
    }

    function handleHashChange() {
      let name = noteFromHash(window.location.hash);
      if (name) {
        sNavigation.navigate(name)
      } else {

      }
    }

    onMount(() => {
      if (!$sNavigation) {
          let note = Object.keys(Notes)[0]
          const lastNote = localStorage.getItem('lastNote');
          if (lastNote && Notes[lastNote]) {
            note = lastNote;
          }

          window.location.hash = `#/${note}`
      }
    })
</script>

<svelte:window on:hashchange={handleHashChange} />

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
    {#if note}
        <div class="flex-grow p-10 flex justify-center overflow-y-auto">
            <div class="note-container">
                <Node node={note.render()} root={true}/>
            </div>
        </div>
    {/if}
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
