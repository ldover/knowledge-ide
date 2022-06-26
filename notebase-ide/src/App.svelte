<script>

  import FileTree from "./FileTree.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import NewFileModal from "./modal/NewFileModal.svelte";
  import Resizer from "./Resizer.svelte";
  import {onMount} from "svelte";
  import {sEditor} from "./store";

  let eFrame;
  onMount(() => {
    eFrame.height = window.innerHeight;
  })

  $: noteName = $sEditor.file?.name?.split('.')[0];
  $: console.log({noteName, file: $sEditor.file})
</script>

<div class="w-full flex h-full overflow-x-hidden">
    <div class="w-3/12 bg-gray-100 overflow-x-auto">
        <FileTree/>
    </div>
    <Resizer/>
    <div class="w-5/12 h-fullvw">
        <CodeMirror/>
    </div>
    <Resizer/>
    <div class="h-full h-fullvw w-4/12">
        {#if noteName}
            <iframe bind:this={eFrame} src="http://localhost:2345/#/{noteName}" height="1000px" width="100%" title="Notebase UI"></iframe>
        {/if}
    </div>
</div>

<ContextMenu/>
<NewFileModal/>

<style lang="scss">
  .h-fullvw {
    height: 100vh;
  }

</style>
