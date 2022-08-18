<script>
  import File from './components/File.svelte'
  import {FILE, HEAD, WORKDIR, STAGE} from "./store";
  import Modal from "../modal/Modal.svelte";
  import Diff from "./components/Diff.svelte";

  export let sGit;
  export let sFileSystem;
  export let sModal;

  const isDeleted = row => row[HEAD] === 1 && row[WORKDIR] === 0;
  const isUnmodified = row => row[HEAD] && row[WORKDIR];
  // todo: this next line might be wrong: I'm trying to get all files that are (a) not staged and (b) have changes
  const isUnstaged = row => row[WORKDIR] !== row[STAGE] && !isUnmodified(row);
  const isStaged = row => row[WORKDIR] === row[STAGE] && !isUnmodified(row);
  const isModified = row => row[HEAD] === 1 && row[WORKDIR] === 2;
  const isNew = row => row[HEAD] === 0 && row[WORKDIR] === 2;
  const isAdded = row => row[HEAD] === 0 && row[WORKDIR] === 2;

  $: unstaged = $sGit.filter(file => isUnstaged(file.status));
  $: staged = $sGit.filter(file => isStaged(file.status));

  let commitMsg;

  let selectedFile;

  async function onSelect(e) {
    const file = e.detail;

    selectedFile = await sFileSystem.getFile(file.path)
  }

  async function onCommit() {
    try {
      await sGit.commit(commitMsg)
      commitMsg = null;
      sModal.hide();
    } catch (err) {
      console.error(err)
      window.alert('Error:' + err)
    }
  }
</script>

<Modal style="width: 80%; height: 80%;" {sModal}>
  <div class="flex w-full h-full">
    <div class="w-7/12 h-full overflow-y-auto overflow-x-auto relative">
      {#if selectedFile}
          <Diff {sGit} file={selectedFile} />
      {/if}
    </div>

    <div class="w-5/12 h-full border-l-2 border-gray-300 flex flex-col justify-between">
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
                    onClick={() => sGit.remove(file)} />
            {/each}
          </div>
        </div>
      </div>

      <div class="border w-full">
        <textarea rows="6"
                  placeholder="Commit message..."
                  bind:value={commitMsg}></textarea>

        <button class="bg-gray-100 rounded-sm px-2 float-right"
                disabled={!commitMsg}
                on:click={onCommit}>Commit</button>
      </div>
    </div>


  </div>
</Modal>

<style lang="scss">

</style>
