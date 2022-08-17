<script>
  export let file;

  export let button;
  export let onClick;
</script>

<div class="flex justify-between items-center">
  <div>{file.path}</div>

  <button class="bg-gray-100 rounded-sm px-2"
          on:click={() => onClick()}>{button}</button>
</div>

<style lang="scss">

</style>
