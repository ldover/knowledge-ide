<script>
  import FileTree from "./filesystem/FileTree.svelte";
  import CodeMirror from "./editor/CodeMirror.svelte";
  import ContextMenu from "./context-menu/ContextMenu.svelte";
  import NewFileModal from "./modal/file/new-file/NewFileModal.svelte";
  import Resizer from "./editor/Resizer.svelte";
  import {Node} from "./notes-ui"
  import {parse as parseMDL, compile as compileMDL} from "@knowledge/mdl"
  import {getEditor} from "./editor/store";
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
  import {getGitDiff} from "./versioning/diff/store";


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
  let sDiff = getGitDiff()
  let sGitModal = getGitModal(sGit, sFileSystem, sDiff)
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
    sDiff,
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
        if (err.code === 'ENOENT') {
          window.location.hash = '';
          console.error('File not found: ' + path);
        } else {
          console.error('onHashChange failed', err);
        }
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
      const files = await sFileSystem.init();
      const isGit = await sGit.isGit();
      if (!isGit) {
        sCloneModal.show();
      }
    } catch (err) {
      // Clone if we empty system
      if (err.code === 'ENOENT') {
        console.info("INFO: no local repository exists — opening git clone modal.")
        sCloneModal.show();
      } else {
        console.error(err)
      }
    }
  })
</script>

<svelte:window on:hashchange={onHashChange} />

<div class="w-full h-full">
  <div class="w-full text-white h-1/6 bg-gray-200 flex">
    <button class="text-gray-900 flex items-center hover:bg-gray-300 px-2 text-sm" on:click={() => sGitModal.show()}>
      <span class="material-symbols-sharp text-gray-900">conversion_path</span> Git
    </button>
  </div>
  <div class="w-full flex h-5/6 overflow-y-hidden overflow-x-hidden">
      <div class="w-3/12 bg-gray-100 text-white overflow-x-auto">
          <FileTree sFileSystem={sFileSystem}/>
      </div>
      <Resizer/>
      <div class="w-5/12 h-fullvw overflow-y-auto">
          <CodeMirror on:mount={onEditorMount}/>
      </div>
      <Resizer/>
      <div class="border-l border-gray-100 h-fullvw w-4/12 flex flex-col" style="--list-style: {isKDL ? 'none' : 'disc'}">
        <div class="w-full justify-end flex border-b">
          <button class="text-gray-900 flex items-center hover:bg-gray-300 px-2 text-sm" on:click={() => onRun()}>
            <span class="material-symbols-sharp text-gray-900">refresh</span> Refresh
          </button>
        </div>
        <div class="px-4 py-3 overflow-y-auto w-full flex-grow">
          {#if note}
            <Node node={note}/>
          {:else}
            (1) Add file (2) Press "Run"
          {/if}
        </div>
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
