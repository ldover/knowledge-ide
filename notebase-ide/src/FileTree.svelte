<script>
  import Folder from './Folder.svelte';
  import {onMount} from "svelte";

  let root = [
    {
      name: 'Important work stuff',
      files: [
        { name: 'quarterly-results.xlsx' }
      ]
    },
    {
      name: 'Animal GIFs',
      files: [
        {
          name: 'Dogs',
          files: [
            { name: 'treadmill.gif' },
            { name: 'rope-jumping.gif' }
          ]
        },
        {
          name: 'Goats',
          files: [
            { name: 'parkour.gif' },
            { name: 'rampage.gif' }
          ]
        },
        { name: 'cat-roomba.gif' },
        { name: 'duck-shuffle.gif' },
        { name: 'monkey-on-a-pig.gif' }
      ]
    },
    { name: 'TODO.md' }
  ];

  onMount(async () => {
    try {
        const data = fetch('http://localhost:8080')
          .then(async (response) => {
            if (!response.ok) {
              let responseJson = await response.json();
              throw responseJson.error;
            }
            return response;
          })
          .then((res) => res.json());

        console.log('fileTree.svelte', data);
    } catch (err) {
      console.error(err);
    }

  })
</script>

<Folder name="Home" files={root} expanded/>
