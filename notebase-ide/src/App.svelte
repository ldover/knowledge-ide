<script>

  import FileTree from "./FileTree.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import NewFileModal from "./modal/NewFileModal.svelte";
  import Resizer from "./Resizer.svelte";
  import {onMount} from "svelte";

  let eFrame;
  onMount(() => {
    eFrame.height = window.innerHeight;
  })
</script>

<div class="w-full flex h-full overflow-x-hidden">
    <div class="w-3/12 bg-gray-100 overflow-x-auto">
        <FileTree/>
    </div>
    <Resizer />
    <div class="w-5/12 h-fullvw">
        <CodeMirror/>
    </div>
    <Resizer />
    <div class="h-full flex-grow">
        <iframe bind:this={eFrame} src="http://localhost:2345" width="100%" title="Notebase UI"></iframe>
    </div>
</div>

<ContextMenu/>
<NewFileModal />

<style lang="scss">
    .h-fullvw {
      height: 100vh;
    }

</style>
