<script>
  import Folder from './Folder.svelte';
  import {onMount} from "svelte";
  import {sEditor} from "./store";

  let root;

  onMount(async () => {
    try {
      const dir = await fetch('http://localhost:8080')
        .then(async (response) => {
          if (!response.ok) {
            let responseJson = await response.json();
            throw responseJson.error;
          }
          return response;
        })
        .then((res) => res.json());

      console.log('fileTree.svelte', dir);
      root = dir;
    } catch (err) {
      console.error(err);
    }
  })

  async function onClick(e) {
    try {
      const file = await fetch('http://localhost:8080/file/' + encodeURIComponent(e.detail.path))
        .then(async (response) => {
          if (!response.ok) {
            let responseJson = await response.json();
            throw responseJson.error;
          }
          return response;
        })
        .then((res) => res.json());

      console.log('file fetched', file);

      if (file.content) {
        sEditor.setValue(file.content)
      } else {
        window.alert('no content in file')
      }
    } catch (err) {
      console.error(err);
    }
  }
</script>

{#if root}
    <Folder file={root} expanded on:click={onClick}/>
{/if}
