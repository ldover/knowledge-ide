<script>
  import File from './components/File.svelte'
  import {FILE, HEAD, WORKDIR, STAGE} from "./store";
  import Modal from "../modal/Modal.svelte";
  import Diff from "./components/Diff.svelte";

  export let sGit;
  export let sModal;

  const isDeleted = row => row[HEAD] === 1 && row[WORKDIR] === 0;
  const isUnstaged = row => row[WORKDIR] !== row[STAGE];
  const isModified = row => row[HEAD] === 1 && row[WORKDIR] === 2;
  const isAdded = row => row[HEAD] === 0 && row[WORKDIR] === 2;

  // TODO: make this correct
  $: unstaged = $sGit.filter(file => isUnstaged(file.status));
  $: staged = $sGit.filter(file => !isUnstaged(file.status));

  let commitMsg;
</script>

<Modal style="width: 80%; height: 80%;" {sModal}>
  <div class="flex w-full h-full">
    <div class="w-7/12 h-full">
      <Diff s0="abc\nqwe" s1="abc\nqee\123" />
    </div>

    <div class="w-5/12 h-full border-l-2 border-gray-300 flex flex-col justify-between">
      <div>
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
</Modal>

<style lang="scss">

</style>
