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
    banners.clear();
    const file = sEditor.getFile();
    file.value = sEditor.getValue();
    const files = sFileSystem.getFiles();

    const parsers = {
      mdl: () => {
        const mdlFiles = files.filter(f => getFileType(f) === 'mdl');
        console.log('parseMDL files')
        parseMDL(mdlFiles);

        try {
          compileMDL(mdlFiles)
          // console.log('compiled', {compiledFiles})
          // const file1 = compiledFiles.find(f => f.path === file.path);
          note = file.data.compiled.render()
        } catch (err) {
          if (err instanceof CompilerError) {
            console.log('compilation error', file, err)
            banners.add('error', err.message, err.loc)
            file.message(err.message, err.loc)
          } else {
            throw err;
          }
        }
      },
      kdl: () => {
        // parseKDL
        const ast = parseKDL(file.value)
        const compiled = compileKDL(ast)
        console.log(compiled.render())
        note = compiled.render();
        // window.alert('Nothing to render here really')
      }
    }

    const fileType = getFileType(file)
    console.log({fileType})
    if (!fileType) {
        return window.alert('Specify one of the supported extensions: .mdl, .kdl.')
    }

    if (file.value) {
      parsers[fileType]();
    }
  }

  $: noteName = $sEditor.file?.name?.split('.')[0];
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
    <div class="h-full h-fullvw w-4/12 p-3">
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
