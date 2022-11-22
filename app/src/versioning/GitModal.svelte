<script>
  import {getContext} from 'svelte';

  import Modal from "../modal/Modal.svelte";
  import Diff from "./diff/Diff.svelte";
  import GitLogTab from "./log/GitLogTab.svelte";
  import GitCommitTab from "./commit/GitCommitTab.svelte";

  export let sModal;
  const {sGitModal, sGit, sGitRemoteModal} = getContext('stores');


  let tabs = [
    {
      name: 'changes'
    },
    {
      name: 'log'
    }
  ]
  let tab = 'changes';

  async function onPush() {
    try {
      await sGit.push()
      window.alert('Push successful')
    } catch (err) {
      let msg = 'Push to remote failed: ' + err;
      console.error(msg)
      console.log({err})
      if (err.code === 'MissingParameterError') {
        window.alert("Git remote missing");
        sGitRemoteModal.show();
      } else if (err.code === 'UnknownTransportError') {
        if (err.data.suggestion) {
          if (window.confirm(`This IDE doesn't support SSH. Use suggested remote instead? — ${err.data.suggestion}`)) {
            await sGit.setRemote(err.data.suggestion);
            onPush();
          }
        }
      } else {
        window.alert('Unhandled error: ' + msg)
      }
    }
  }
</script>

<Modal style="width: 80%; height: 80%;" {sModal}
       closeOnOutClick={false}>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-end bg-gray-700">
      <button class="text-gray-100 flex items-center hover:bg-gray-600 px-2 text-sm"
              on:click={() => sGitModal.hide()}>
        <span class="material-symbols-sharp text-gray-100">close</span> Close
      </button>
    </div>
    <div class="flex w-full h-full">
      <div class="w-7/12 bg-white h-full overflow-y-auto overflow-x-auto relative">
        <Diff/>
      </div>

      <div class="w-5/12 h-full border-l border-gray-200 bg-gray-100 flex flex-col">
        <div class="flex justify-end bg-gray-700 border-t border-gray-100">
          <button class="text-gray-100 flex items-center hover:bg-gray-600 px-2 text-sm"
                  on:click={() => sGit.pull()}>
            <span class="material-symbols-sharp text-gray-100">file_download</span> Pull
          </button>
          <button class="text-gray-100 flex items-center hover:bg-gray-600 px-2 text-sm"
                  on:click={onPush}>
            <span class="material-symbols-sharp text-gray-100">publish</span> Push
          </button>
          <button class="text-gray-100 flex items-center hover:bg-gray-600 px-2 text-sm"
                  on:click={() => sGit.refresh()}>
            <span class="material-symbols-sharp text-gray-100">refresh</span> Refresh
          </button>
        </div>
        <div class="flex justify-between border-b border-gray-300">
          {#each tabs as t}
            <button class="flex-grow capitalize text-gray-700 text-sm"
                    class:bg-white={t.name !== tab }
                    class:bg-gray-300={t.name === tab }
                    on:click={() => tab = t.name}>
              {t.name}
            </button>
          {/each}
        </div>
        <div class="flex-grow relative overflow-y-auto">
          {#if tab === 'changes'}
            <GitCommitTab/>
          {:else if tab === 'log'}
            <GitLogTab/>
          {/if}
        </div>
      </div>
    </div>
  </div>
</Modal>

<style lang="scss">

</style>
