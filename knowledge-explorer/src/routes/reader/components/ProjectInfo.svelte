<script>
  export let article;

  const rows = [
    {
      field: "title",
      value: article.title
    },
    {
      field: "author",
      value: article.author
    },
    {
      field: "version",
      value: article.version
    },
    {
      field: "repository",
      value: `<a href="${article.repository}" target="_blank">${article.repository}</a>`
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
