<script>
  import File from './components/File.svelte'
  import {FILE, HEAD, WORKDIR, STAGE} from "./store";
  export let sGit;

  const isDeleted = row => row[HEAD] === 1 && row[WORKDIR] === 0;
  const isUnstaged = row => row[WORKDIR] !== row[STAGE];
  const isModified = row => row[HEAD] === 1 && row[WORKDIR] === 2;
  const isAdded = row => row[HEAD] === 0 && row[WORKDIR] === 2;

  // TODO: make this correct
  $: unstaged = $sGit.filter(file => isUnstaged(file.status));
  $: staged = $sGit.filter(file => !isUnstaged(file.status));

  let commitMsg;
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

    <div class="border w-full">
      <textarea rows="6"
                placeholder="Commit message..."
                bind:value={commitMsg}></textarea>

      <button class="bg-gray-100 rounded-sm px-2 float-right"
              disabled={!commitMsg}
              on:click={() => sGit.commit(commitMsg)}>Commit</button>
    </div>
</div>

</div>

<style lang="scss">

</style>
