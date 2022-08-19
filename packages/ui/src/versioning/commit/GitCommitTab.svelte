<script>
  import {getContext, createEventDispatcher} from 'svelte';
  import File from '../components/File.svelte'
  const dispatch = createEventDispatcher();


  import {HEAD, STAGE, WORKDIR} from "../store";

  const {sGitModal, sGit} = getContext('stores');


  const isDeleted = row => row[HEAD] === 1 && row[WORKDIR] === 0;
  const isUnmodified = row => row[HEAD] === row[WORKDIR];
  // todo: this next line might be wrong: I'm trying to get all files that are (a) not staged and (b) have changes
  const isUnstaged = row => row[WORKDIR] !== row[STAGE] && !isUnmodified(row);
  const isStaged = row => row[WORKDIR] === row[STAGE] && !isUnmodified(row);
  const isModified = row => row[HEAD] === 1 && row[WORKDIR] === 2;
  const isNew = row => row[HEAD] === 0 && row[WORKDIR] === 2;
  const isAdded = row => row[HEAD] === 0 && row[WORKDIR] === 2;

  $: files =  $sGit.map(file => {
    return {
      ...file,
      modified: isModified(file.status),
      removed: isDeleted(file.status),
      added: isNew(file.status),
      staged: isStaged(file.status),
      unstaged: isUnstaged(file.status),
    }
  })

  $: unstaged = files.filter(file => file.unstaged);
  $: staged = files.filter(file => file.staged);

  let commitMsg;


  async function onSelect(e) {
    const file = e.detail;
    sGitModal.select(file)
  }

  async function onCommit() {
    try {
      await sGit.commit(commitMsg)
      commitMsg = null;
      sGitModal.hide();
    } catch (err) {
      console.error(err)
      window.alert('Error:' + err)
    }
  }
</script>

<div class="h-full flex flex-col justify-between bg-gray-200 p-2">
  <div>
    <button on:click={() => sGit.refresh()}>Refresh</button>

    <div class="border mb-3 w-full">
      <div class="flex justify-between border">
        <div class="font-bold">Unstaged</div>
        <button>Stage all</button>
      </div>
      <div>
        {#each unstaged as file}
          <File file={file}
                on:select={onSelect}
                button="Stage"
                onClick={() => sGit.add(file)}
          />
        {/each}
      </div>
    </div>
    <div class="border w-full">
      <div class="flex justify-between border w-full">
        <div class="font-bold">Staged</div>
      </div>
      <div>
        {#each staged as file}
          <File file={file}
                on:select={onSelect}
                button="Unstage"
                onClick={() => sGit.remove(file)}/>
        {/each}
      </div>
    </div>
  </div>

  <div class="border w-full flex flex-col">
    <textarea rows="6"
              class="w-full bg-white border p-2"
              placeholder="Commit message..."
              bind:value={commitMsg}></textarea>

    <div>
      <button class="bg-white rounded-sm px-8 mt-2"
              disabled={!commitMsg}
              on:click={onCommit}>Commit
      </button>
    </div>
  </div>

</div>

<style lang="scss">

</style>
