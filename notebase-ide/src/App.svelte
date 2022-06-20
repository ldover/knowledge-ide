<script>

  import FileTree from "./FileTree.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import {onMount} from "svelte";

  let visible;
  onMount(() => {
    const eContextMenu = document.getElementById('context-menu');
    console.log({eContextMenu})
    document.body.addEventListener('contextmenu', (event) => {
      event.preventDefault();

      const {clientX, clientY} = event;

      eContextMenu.style.top = `${clientY}px`;
      eContextMenu.style.left = `${clientX}px`;
      visible = true;
    })
  })
</script>

<div class="w-full flex h-full justify-between overflow-x-hidden">
    <div class="w-64 bg-gray-100">
        <FileTree/>
    </div>
    <div class="w-1/3 h-full">
        <CodeMirror/>
    </div>
    <div class="w-1/3 h-full">
        <iframe src="http://localhost:2345" height="1000px" width="100%" title="Notebase UI"></iframe>
    </div>
</div>

<ContextMenu bind:visible={visible}/>

<style lang="scss">

</style>
