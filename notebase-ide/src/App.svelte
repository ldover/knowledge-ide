<script>

  import FileTree from "./FileTree.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import NewFileModal from "./modal/NewFileModal.svelte";
  import Resizer from "./Resizer.svelte";
</script>

<div class="w-full flex h-full overflow-x-hidden">
    <div class="w-64 bg-gray-100 overflow-x-hidden">
        <FileTree/>
    </div>
    <Resizer />
    <div class="w-1/3 h-full">
        <CodeMirror/>
    </div>
    <Resizer />
    <div class="h-full flex-grow">
        <iframe src="http://localhost:2345" height="1000px" width="100%" title="Notebase UI"></iframe>
    </div>
</div>

<ContextMenu/>
<NewFileModal />

<style lang="scss">

</style>
