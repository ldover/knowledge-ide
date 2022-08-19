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
  import {getGit, getGitModal} from "./versioning/store";
  import GitModal from "./versioning/GitModal.svelte";
  import {getModal} from "./modal/store";
  import {getGitLogTab} from "./versioning/log/store";


  let note = null;
  let file = null;

  $: isKDL = file && file.extname === '.kdl';
  $: isMDL = file && file.extname === '.mdl';

  let sFileSystem = getFileSystem()
  let sEditor = getEditor(sFileSystem)
  let sNewFileModal = getNewFileModal(sFileSystem)
  let sRenameModal = getRenameModal(sFileSystem)
  let sGit = getGit(sFileSystem)
  let sCloneModal = getCloneModal(sFileSystem, sGit)
  let sContextMenu = getContextMenu(sNewFileModal, sRenameModal, sFileSystem, sCloneModal)
  let sGitModal = getGitModal(sGit, sFileSystem)
  let sGitLogTab = getGitLogTab(sGit, sGitModal)

  let scope = {
    sFileSystem,
    sEditor,
    sContextMenu,
    sNewFileModal,
    sRenameModal,
    sCloneModal,
    sGit,
    sGitModal,
    sGitLogTab,
  };

  setContext('stores', scope);

  function process(files) {
    parseMDL(files);
    compileMDL(files)
  }

  async function onRun() {
    banners.clear();
    const currentFile = sEditor.getFile();
    const currentValue = sEditor.getValue();

    let files = await sFileSystem.getFiles();
    files = files.filter(f => !f.basename?.startsWith('.') && ['.kdl', '.mdl', '.png', '.jpg'].includes(f.extname));
    if (!files.length) {
      return console.warn('No files to run');
    }

    try {
      // Abstract everything away in the process method
      process(files)
      const file = files.find(f => f.path === currentFile.path);
      if (!file) {
        return console.error('ERROR: File not found')
      }
      if (!file.data.compiled) {
        return console.warn('WARN: file cannot run since it did not compile')
      }

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

  async function onHashChange() {
    let path = window.location.hash.slice(2);
    if (path) {
      try {
        const f = await sFileSystem.getFile(path);
        if (f) {
          sEditor.setFile(f);
          onRun()
        }
      } catch (err) {
        console.error('onHashChange failed', err);
      }
    }
  }

  function onEditorMount(e) {
    sEditor.init(e.detail);
  }

  onMount(async () => {
    if (window.location.hash) {
      onHashChange();
    }

    try {
      await sFileSystem.init()
      await sGit.init();
      await sGitLogTab.init();
    } catch (err) {
      // Clone if we empty system
      if (err.code === 'ENOENT') {
        console.info("INFO: no repo found, cloning anew.")
        await sGit.clone();
        console.info('INFO: cloning finished')
      } else {
        console.error(err)
      }
    }
  })
</script>

<svelte:window on:hashchange={onHashChange} />

<div class="w-full h-full">
  <div class="w-full text-white h-1/6 bg-black">
    <div class>Toolbar</div>
    <button on:click={() => sGitModal.show()}>Open Git</button>
  </div>
  <div class="w-full flex h-5/6 overflow-y-hidden overflow-x-hidden">
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
</div>

<ContextMenu {sContextMenu}/>
<NewFileModal sModal={sNewFileModal}/>
<RenameModal sModal={sRenameModal}/>
<CloneModal sModal={sCloneModal}/>
<GitModal sModal={sGitModal}/>

<style lang="scss">
  .h-fullvw {
    height: 100vh;
    max-height: 100vh;
  }

</style>
