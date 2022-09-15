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

  const url = 'https://gitlab.com/ldover/knowledge-engineering.git'

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
    function _onAuth(url) {
      console.log('auth hook engaged')
      const accessToken = "glpat-BGtxsx7pLueNwXSyzWHn"
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
      corsProxy: 'https://cors.isomorphic-git.org',
      onAuth: (url) => _onAuth(url)
    })
  }

  function process(files) {
    parseMDL(files);
    compileMDL(files)

    return files;
  }

  let rendered = null;
  let status = 'clone: ' + url
  let statusMsg = null;
  onMount(async () => {
    try {
      let files;
      try {
        files = await getFiles();
        if (files.length) {
          console.log('already cloned')
        }
      } catch (err) {
        // No project yet — clone
        if (err.code === 'ENOENT') {
          status = 'cloning'
          await clone(url)
          status = 'clone finished'
          files = await getFiles()
        }
      }

      files = await process(files)
      status = 'compile finished';
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
      statusMsg = err + '';
    }
  })
</script>

<div class="w-full h-full flex justify-center">
  <div class="content">
    {#if rendered}
      <Node node={rendered}></Node>
    {:else}
      <div>
        <div>Processing ...</div>
        <div>Status: {status}</div>
        {#if statusMsg}
          <div>Status message: {statusMsg}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .content {
    max-width: 600px;
  }
</style>
