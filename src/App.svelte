<script>
  import FileTree from "./FileTree.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import NewFileModal from "./modal/NewFileModal.svelte";
  import Resizer from "./Resizer.svelte";
  import {Node} from "./notes-ui"
  import {parse as parseMDL, compile as compileMDL} from "../mdl/src/index"
  import {parse as parseKDL} from "../kdl/src/index"
  import {onMount} from "svelte";
  import {sEditor} from "./store";

  console.log({parseMDL, parseKDL})

  let note = {
    type: "root",
    children: [
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'Empty file'}
        ]
      }
    ]
  }

  function onRun() {
    const file = sEditor.getFile();
    if (file.value) {

      // Todo: accept VFile interface
      // todo: perhaps expand to multiple files
      const ast = parseMDL(file.value)
      file.data.parsed = ast;
      const file1 = compileMDL([file])[0] // todo expand to multiple files
      console.log('compiled', {file, file1})
      note = file1.data.compiled.render()
    }
  }

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
        <Node node={note} />
    </div>
    <div class="absolute top-0 right-0 m-3">
        <button class="px-16 text-lg bg-green-600 text-white" on:click={onRun}>Run</button>
    </div>
</div>

<ContextMenu/>
<NewFileModal/>

<style lang="scss">
  .h-fullvw {
    height: 100vh;
  }

</style>
