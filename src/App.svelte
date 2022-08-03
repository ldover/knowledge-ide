<script>
  import FileTree from "./FileTree.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import NewFileModal from "./modal/NewFileModal.svelte";
  import Resizer from "./Resizer.svelte";
  import {Node} from "./notes-ui"
  import {parse as parseMDL, compile as compileMDL} from "../mdl/src/index"
  import {parse as parseKDL, compile as compileKDL} from "../kdl/src/index"
  import {sEditor, sFileSystem} from "./store";
  import {banners} from "./banner/store";
  import {CompilerError} from "../mdl/src/compiler";
  import {getFileType} from "./util";
  import {onMount} from "svelte";

  let note = null;
  let file = null;

  sFileSystem.init()

  function process(files) {
    console.log('parse files', files)

    parseMDL(files);
    compileMDL(files)
  }

  function onRun() {
    banners.clear();
    const file = sEditor.getFile();
    file.value = sEditor.getValue();
    const files = sFileSystem.getFiles();

    try {
      // Abstract everything away in the process method
      process(files)
      note = file.data.compiled.render()
    } catch(err) {
      if (err instanceof CompilerError) {
        console.log('compilation error', file, err)
        banners.add('error', err.message, err.loc)
        file.message(err.message, err.loc)
      } else {
        throw err;
      }
    }
  }

  $: noteName = $sEditor.file?.name?.split('.')[0];

  function onHashChange() {
    let path = window.location.hash.slice(2);
    if (path) {
      const fullpath = `~/${path}`
      const f = $sFileSystem.find(f => f.path === fullpath);
      if (f) {
        sEditor.setFile(f);
        onRun()
      }
    }
  }

  function onEditorMount(e) {
    sEditor.init(e.detail);
  }

  onMount(() => {
    if (window.location.hash) {
      onHashChange();
    }
  })
</script>

<svelte:window on:hashchange={onHashChange} />

<div class="w-full flex h-full overflow-x-hidden">
    <div class="w-3/12 bg-gray-100 overflow-x-auto">
        <FileTree/>
    </div>
    <Resizer/>
    <div class="w-5/12 h-fullvw">
        <CodeMirror on:mount={onEditorMount}/>
    </div>
    <Resizer/>
    <div class="h-full h-fullvw w-4/12 p-3">
      {#if note}
        <Node node={note}/>
      {:else}
        (1) Add file (2) Press "Run"
      {/if}
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
