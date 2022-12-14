<script>
  import {getContext, createEventDispatcher} from 'svelte';
  import File from '../components/File.svelte'
  const dispatch = createEventDispatcher();


  import {HEAD, STAGE, WORKDIR} from "../store";

  const {sGitModal, sGit, sGitUserModal} = getContext('stores');


  const isDeleted = row => row[HEAD] === 1 && row[WORKDIR] === 0;
  const isUnmodified = row => row[HEAD] === row[WORKDIR];
  const isUnstaged = row => row[WORKDIR] !== row[STAGE] && !isUnmodified(row);
  const isStaged = row => row[WORKDIR] === row[STAGE] && !isUnmodified(row);
  const isModified = row => row[HEAD] === 1 && row[WORKDIR] === 2;
  const isNew = row => row[HEAD] === 0 && row[WORKDIR] === 2;
  const isAdded = row => row[HEAD] === 0 && row[WORKDIR] === 2;

  $: files =  $sGit.map(file => {
    let f = {
      ...file,
      modified: isModified(file.status),
      removed: isDeleted(file.status),
      added: isNew(file.status),
      staged: isStaged(file.status),
      unstaged: isUnstaged(file.status),
    }

    f.status = f.modified ? 'modified' : f.added ? 'added' : 'removed'

    return f;
  })

  $: unstaged = files.filter(file => file.unstaged);
  $: staged = files.filter(file => file.staged);

  let commitMsg;


  async function onSelect(e) {
    const file = e.detail;
    sGitModal.select(file)
  }

  async function onCommit() {
    if (!commitMsg) {
      return window.alert('Specify commit message')
    }

    try {
      await sGit.commit(commitMsg)
      commitMsg = null;
      window.alert('Commit successful!')
    } catch (err) {
      console.error(err)
      if (err.code === 'MissingNameError') {
        window.alert('You have to specify local Git credentials before committing.')
        return sGitUserModal.show();
      } else {
        window.alert(err)
      }
    }
  }
</script>

<div class="h-full flex flex-col justify-between text-sm">
  <div>
    <div class="mb-3 w-full">
      <div class="flex justify-between pl-2 pt-2">
        <div class="font-medium">Unstaged</div>
        <div class="flex">
          <button class="text-gray-900 bg-white flex items-center hover:bg-gray-300 px-2 text-sm"
                     on:click|stopPropagation={() => sGit.rollback(...unstaged)}>
          <span class="material-symbols-sharp text-gray-900">undo</span> Revert all
        </button>
          <button class="text-gray-900 bg-white flex items-center hover:bg-gray-300 px-2 text-sm"
                  on:click={() => sGit.stage(...unstaged)}>
            <span class="material-symbols-sharp text-gray-900">file_download</span> Stage all
          </button>
        </div>
      </div>
      <div>
        {#each unstaged as file}
          <File file={file}
                status={file.status}
                on:select={onSelect}>
            <div class="flex">
              <button class="text-gray-900 bg-white flex items-center hover:bg-gray-300 px-2 text-sm"
                      on:click|stopPropagation={() => sGit.rollback(file)}>
                <span class="material-symbols-sharp text-gray-900">undo</span> Revert
              </button>
              <button class="text-gray-900 bg-white flex items-center hover:bg-gray-300 px-2 text-sm"
                      on:click|stopPropagation={() => sGit.stage(file)}>
                <span class="material-symbols-sharp text-gray-900">file_download</span> Stage
              </button>
            </div>
          </File>
        {/each}
      </div>
    </div>
    <div class="w-full">
      <div class="flex justify-between w-full pt-2 pl-2">
        <div class="font-medium">Staged</div>
      </div>
      <div>
        {#each staged as file}
          <File file={file}
                status={file.status}
                on:select={onSelect}>
            <div class="flex">
              <button class="text-gray-900 bg-white flex items-center hover:bg-gray-300 px-2 text-sm"
                      on:click|stopPropagation={() => sGit.rollback(file)}>
                <span class="material-symbols-sharp text-gray-900">undo</span> Revert
              </button>
              <button class="text-gray-900 bg-white flex items-center hover:bg-gray-300 px-2 text-sm"
                      on:click|stopPropagation={() => sGit.remove(file)}>
                <span class="material-symbols-sharp text-gray-900">file_upload</span> Unstage
              </button>
            </div>
          </File>
        {/each}
      </div>
    </div>
  </div>

  <div class="w-full flex flex-col p-2">
    <textarea rows="6"
              class="w-full bg-white border p-2"
              placeholder="Commit message..."
              bind:value={commitMsg}></textarea>

    <div>
      <button class="bg-sky-700 text-white border rounded-sm px-8 mt-2 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              disabled={!staged.length}
              on:click={onCommit}>Commit
      </button>
    </div>
  </div>

</div>

<style lang="scss">

</style>
