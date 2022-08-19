<script>
  import moment from 'moment';


  export let log = [
    {
      message: 'message 1',
      date: Date.now() - 36000,
      user: 'ldover',
      branch: 'main',
      files: [
        {
          path: '/knowledge-library/README.md',
        }
      ]
    },
    {
      message: 'message 1',
      date: Date.now() - 37000,
      user: 'ldover',
      branch: 'main',
      files: [
        {
          path: '/knowledge-library/test.mdl',
        }
      ]
    }
  ]

  let selected;
</script>

<div class="w-full flex flex-col justify-between">
  <!-- Log -->
  <div class="border">
    {#each log as commit}
      <div on:click={() => selected = commit}
           class="flex cursor-pointer"
           class:bg-gray-100={commit === selected}
      >
        <div class="w-6/12">{commit.message}</div>
        <div class="w-2/12">{commit.branch}</div>
        <div class="w-2/12">{commit.user}</div>
        <div class="w-2/12">{moment(commit.date).fromNow()}</div>
      </div>
    {/each}
  </div>

  <!-- Selected commit files  -->
  <div class="border">
    {#if selected}
      {#each selected.files as file}
        <div>{file.path}</div>
      {/each}
    {/if}
  </div>

</div>

<style lang="scss">

</style>
