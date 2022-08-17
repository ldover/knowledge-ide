<script>
  import File from './components/File.svelte'
  export let sGit;

  $: unstaged = $sGit.filter(f => f.status === 'unstaged')
  $: staged = $sGit.filter(f => f.status === 'staged')
</script>

<div class="w-full">
  <div class="border mb-3 w-full">
    <div class="flex justify-between border">
      <div class="font-bold">Unstaged</div>
      <button>Stage all</button>
    </div>
    <div>
      {#each unstaged as file}
        <File file={file} button="Stage" onClick={() => sGit.add(file)} />
      {/each}
    </div>
  </div>
  <div class="border w-full">
    <div class="flex justify-between border w-full">
      <div class="font-bold">Staged</div>
    </div>
    <div>
      {#each staged as file}
        <File file={file} button="Unstage" onClick={() => sGit.remove(file)} />
      {/each}
    </div>
</div>

</div>

<style lang="scss">

</style>
