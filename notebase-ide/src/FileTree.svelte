<script>
  import Folder from './Folder.svelte';
  import {onMount} from "svelte";

  let root = [];

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
        root = [dir]
    } catch (err) {
      console.error(err);
    }

  })
</script>

<Folder name="Home" files={root} expanded/>
