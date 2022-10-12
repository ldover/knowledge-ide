<script>
  const rows = [
    {
      field: "title",
      value: "Scaling Civilization Knowledge"
    },
    {
      field: "author",
      value: "Luka Dover"
    },
    {
      field: "version",
      value: "v1.0"
    },
    {
      field: "repository",
      value: `<a href="https://gitlab.com/ldover/knowledge-library.git" target="_blank">https://gitlab.com/ldover/knowledge-library.git</a>`
    },
  ]

</script>

<div class="w-full project-info text-white">
  {#each rows as row}
    <div class="flex flex-col w-full mb-4  border-b border-white">
      <div class="text-xs capitalize text-gray-200 merriweather">
        {row.field}
      </div>
      <div class="">
        {@html row.value}
      </div>
    </div>
  {/each}

</div>

<style>
  :global(a) {
    @apply text-sky-500;
  }

  .project-info {
    /*width: 300px*/
  }
</style>
