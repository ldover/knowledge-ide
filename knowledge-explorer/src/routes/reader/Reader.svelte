<script>
  import {onMount} from 'svelte';
  import * as git from 'isomorphic-git';
  import * as http from 'isomorphic-git/http/web';
  import LightningFS from '@isomorphic-git/lightning-fs';
  import {VFile} from "vfile";
  import {Node} from "@knowledge/reader";
  import {compile as compileMDL, parse as parseMDL} from "@knowledge/mdl";
  import ProjectInfo from "./components/ProjectInfo.svelte";


  const cached = localStorage.getItem('repository') && localStorage.getItem('repository') === url;

  const fs = new LightningFS('fs', {wipe: !cached});

  const rootDir = '/project'

  const urlParams = new URLSearchParams(window.location.hash.substring(2).split('?')[1])
  let url = urlParams.get('repository');
  console.log({url})

  let enteredUrl;
  let downloading = !!url;

  const corsProxy = import.meta.env.DEV ? 'https://knowledge-explorer-iiy8pvktp-ldover.vercel.app/api' : `${window.location.origin}/api`

  async function getFiles() {
    async function _getAllFiles(dirPath) {
      const dirFiles = await fs.promises.readdir(dirPath)
      const files = await Promise.all(dirFiles.map(async file => {
        let filepath = [dirPath, file].join('/');
        const stat = await fs.promises.stat(filepath)
        const vfile = new VFile({path: file});

        if (stat.type === 'dir') {
          // Don't read the empty folder
          if (vfile.basename.startsWith('.')) {
            return null;
          }
          return _getAllFiles(filepath);
        } else {
          const name = vfile.basename;
          const extname = vfile.extname;
          return {
            type: 'file',
            name,
            extname,
            path: filepath,
          }
        }
      }))

      return {
        type: 'folder',
        name: new VFile({path: dirPath}).basename,
        path: dirPath,
        files: files.filter(f => f !== null) // filter out null returns (empty folders)
      }
    }

    function flatten(dir) {
      if (!dir) return [];

      function walk(dir) {
        return dir.files.reduce((allFiles, nextFile) => nextFile.type === 'folder' ? [...allFiles, ...walk(nextFile)] : [...allFiles, nextFile], [])
      }

      return walk(dir);
    }

    let dir = await _getAllFiles(rootDir)
    const filePaths = flatten(dir)
    return Promise.all(filePaths.map(async file => {
      const filepath = file.path;
      let value = null;
      const extname = new VFile({path: filepath}).extname;
      const isHidden = new VFile({path: filepath}).basename.startsWith('.');

      if (!isHidden) {
        if (['.mdl', '.kdl', '.mdl', '.md', '.png', '.jpg'].includes(extname)) {
          value = await fs.promises.readFile(filepath, {encoding: 'utf8'})
        }
      }
      return new VFile({value: value, path: filepath})
    }))
  }

  async function clone(url) {
    status = '(1/2) Cloning repository ' + url

    function _onAuth(url) {
      console.log('auth hook engaged')
      const accessToken = "glpat-ZF1w2my4tExZsGvyfbbw"
      const username = "ldover";

      return {
        username,
        password: accessToken
      };
    }

    console.info('INFO: cloning ' + url, {dir: rootDir, fs, http})
    await git.clone({
      fs: fs,
      http,
      dir: rootDir,
      url,
      corsProxy: corsProxy,
      onAuth: (url) => _onAuth(url)
    })
    console.info("INFO: cloning finished")
  }

  function process(files) {
    parseMDL(files);
    compileMDL(files)

    return files;
  }

  let rendered = null;
  let status = '';
  let errorMsg = null;

  async function download(url) {
    downloading = true;
    try {
      let files;
      try {
        if (cached) {
          files = await getFiles();
        }

        if (files === undefined || !files.length) {
          await clone(url)
          files = await getFiles()
          localStorage.setItem('repository', url);
        }
      } catch (err) {
        // No project yet — clone
        if (err.code === 'ENOENT') {
          await clone(url)
          files = await getFiles()
        } else {
          throw err;
        }
      }

      status = '(2/2) Compiling code'
      files = await process(files)

      // todo: take root path from from package json entrypoint
      const file = files.find(file => file.basename === 'index.mdl')

      if (!file) {
        return console.error('ERROR: File not found')
      }
      if (!file.data.compiled) {
        return console.warn('WARN: file cannot run since it did not compile')
      }

      rendered = file.data.compiled.render()


    } catch (err) {
      console.log(err)
      status = 'error'
      errorMsg = err + '';
    }

  }

  onMount(async () => {

    if (url) {
      await download(url)
    }
  })
</script>


<div class="w-full flex flex-col items-center">
  <div class="w-full bg-indigo-500 hero flex flex-col items-center justify-center">
    <a href="/" class="text-gray-400 mb-2 w-full pl-6 pt-4">← Index</a>
    <div class="content pt-4 pb-4 px-6">
      <ProjectInfo/>
    </div>
  </div>

  <div class="content p-6">
    {#if rendered}
      <Node node={rendered}></Node>
    {:else}
      <div>
        <div class="text-lg">Status: {status}</div>
        {#if errorMsg}
          <div class="text-gray-600 text-xs">{errorMsg}</div>
        {/if}
      </div>
    {/if}
  </div>
  <div class="w-full bg-gray-100 py-16 px-6 flex justify-center">
    <a href="/" class="text-gray-400 underline">Back to index</a>
  </div>
</div>

<style lang="scss">
  .hero {
    //min-height: 40vh;
    @apply bg-black ;
  }
  .content {
    width: 100%;
    max-width: 600px;
  }
</style>
