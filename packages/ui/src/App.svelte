<script>
  import FileTree from "./filesystem/FileTree.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import ContextMenu from "./context-menu/ContextMenu.svelte";
  import NewFileModal from "./modal/file/new-file/NewFileModal.svelte";
  import Resizer from "./Resizer.svelte";
  import {Node} from "./notes-ui"
  import {parse as parseMDL, compile as compileMDL} from "@knowledge/mdl"
  import {getEditor} from "./store";
  import {banners} from "./banner/store";
  import {CompilerError} from "@knowledge/mdl";
  import {onMount, setContext} from "svelte";
  import {getNewFileModal} from "./modal/file/new-file/store";
  import {getContextMenu} from "./context-menu/store";
  import {getRenameModal} from "./modal/file/rename/store";
  import {getCloneModal} from "./modal/clone/store";
  import RenameModal from "./modal/file/rename/RenameModal.svelte";
  import CloneModal from "./modal/clone/CloneModal.svelte";
  import {getFileSystem} from "./filesystem/store";


  let note = null;
  let file = null;

  $: isKDL = file && file.extname === '.kdl';
  $: isMDL = file && file.extname === '.mdl';

  let sFileSystem = getFileSystem()
  let sEditor = getEditor(sFileSystem)
  let sNewFileModal = getNewFileModal(sFileSystem)
  let sRenameModal = getRenameModal(sFileSystem)
  let sCloneModal = getCloneModal(sFileSystem)
  let sContextMenu = getContextMenu(sNewFileModal, sRenameModal, sFileSystem, sCloneModal)

  setContext('stores', {
    sFileSystem,
    sEditor,
    sContextMenu,
    sNewFileModal,
    sRenameModal,
    sCloneModal
  });

  sFileSystem.init()


  function process(files) {
    console.log('parse files', files)

    parseMDL(files);
    compileMDL(files)
  }

  function onRun() {
    // return;

    banners.clear();
    file = sEditor.getFile();
    file.value = sEditor.getValue();
    const files = sFileSystem.getFiles()
      .filter(f => !f.basename?.startsWith('.') && ['.kdl', '.mdl', '.png', '.jpg'].includes(f.extname));

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

<div class="w-full flex h-full overflow-y-hidden overflow-x-hidden">
    <div class="w-3/12 bg-gray-600 text-white overflow-x-auto">
        <FileTree sFileSystem={sFileSystem}/>
    </div>
    <Resizer/>
    <div class="w-5/12 h-fullvw overflow-y-auto">
        <CodeMirror on:mount={onEditorMount}/>
    </div>
    <Resizer/>
    <div class="h-fullvw w-4/12 px-8 py-3 overflow-y-auto" style="--list-style: {isKDL ? 'none' : 'disc'}">
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

<ContextMenu {sContextMenu}/>
<NewFileModal sModal={sNewFileModal}/>
<RenameModal sModal={sRenameModal}/>
<CloneModal sModal={sCloneModal}/>

<style lang="scss">
  .h-fullvw {
    height: 100vh;
    max-height: 100vh;
  }

</style>
