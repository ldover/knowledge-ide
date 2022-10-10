<script>
  import {onMount} from 'svelte';
  import * as git from 'isomorphic-git';
  import * as http from 'isomorphic-git/http/web';
  import LightningFS from '@isomorphic-git/lightning-fs';
  import {VFile} from "vfile";
  import {Node} from "@knowledge/reader";
  import {compile as compileMDL, parse as parseMDL} from "@knowledge/mdl";


  const fs = new LightningFS('fs');

  const rootDir = '/project'

  const urlParams = new URLSearchParams(window.location.search);
  // const url = 'https://gitlab.com/ldover/knowledge-engineering.git'
  let url = urlParams.get('repository')

  let enteredUrl;
  let downloading = !!url;

  const corsProxy = import.meta.env.DEV ? 'http://localhost:3000/api' : `${window.location.origin}/api`

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
      const accessToken = "glpat-gubo7pXMQUzzo6J4W9Hz"
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
        files = await getFiles();
        if (!files.length) {
          await clone(url)
          files = await getFiles()
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

  function onDownload() {
    url = enteredUrl;
    download(url);
  }
</script>

<div class="w-full h-full flex justify-center">
  {#if !url}
    <div class="flex flex-col justify-center items-start">
      <div class="text-xs mb-4 text-gray-700">Experimental web app for reading MDL articles.</div>
      <div>Enter link to GitHub repository:</div>

      <input class="rounded-sm border border-gray-600 text-sm px-1 py-1"
             placeholder="https://github.com/ldover/knowledge-engineering.git"
             type="text" bind:value={enteredUrl} />

      <button class="bg-sky-700 text-white rounded-sm px-4 text-lg mt-2" on:click={onDownload}>Open</button>
    </div>
  {:else}
    <div class="absolute right-0 top-0 p-6">
      <a href={url} class="text-gray-900 text-blue-500 text-xs" target="_blank">
        <img src="./assets/GitHub-Mark-120px-plus.png" width="32px" alt="GitHub logo"/>
      </a>
    </div>
    <div class="content p-6 pt-16">
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
  {/if}
</div>

<style lang="scss">
  input {
    width: 350px;
  }

  .content {
    width: 100%;
    max-width: 600px;
  }
</style>
