<script>
  import Modal from "../modal/Modal.svelte";
  import Diff from "./components/Diff.svelte";
  import GitLogTab from "./log/GitLogTab.svelte";
  import GitCommitTab from "./commit/GitCommitTab.svelte";

  export let sModal;


  let tabs = [
    {name: 'changes'},
    {name: 'log'}
  ]
  let tab = 'changes';
</script>

<Modal style="width: 80%; height: 80%;" {sModal}>
  <div class="flex w-full h-full">
    <div class="w-7/12 h-full overflow-y-auto overflow-x-auto relative">
      {#if $sModal.selectedFile}
        <Diff file={$sModal.selectedFile}/>
      {/if}
    </div>

    <div class="w-5/12 h-full border-l-2 border-gray-300">
      <div class="flex justify-between">
        {#each tabs as t}
          <button class="flex-grow"
                  on:click={() => tab = t.name}>
            {t.name}
          </button>
        {/each}
      </div>
      {#if tab === 'changes'}
        <GitCommitTab/>
      {:else if tab === 'log'}
        <GitLogTab/>
      {/if}
    </div>


  </div>
</Modal>

<style lang="scss">

</style>
