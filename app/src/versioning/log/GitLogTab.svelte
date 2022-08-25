<script>
  import {getContext, onMount} from 'svelte';
  import moment from 'moment';

  import File from '../components/File.svelte'

  const {sGitLogTab, sGitModal, sDiff} = getContext('stores')

  onMount(() => {
    sGitLogTab.refresh()
  })

  const formatTime = (ts) => {
    const m0 = moment.unix(ts)
    if (m0.isAfter(moment().subtract(1, 'hour'))) {
      return m0.fromNow()
    } else {
      return m0.format('MM/DD/YY, HH:mm A')
    }
  }

  async function onSelect(e) {
    const file = e.detail;

    sDiff.showDiff(file.data.file0, file.data.file1, file.path)
  }
</script>

<div class="w-full flex flex-col overflow-y-auto text-sm">
  <div class="p-2 font-bold">
    Branch: {$sGitLogTab.branch}
  </div>

  <!-- Log -->
  <div class="border-t h-1/2 overflow-y-auto bg-gray-50">
    {#each $sGitLogTab.logs as commitRes}
      <div on:click={() => sGitLogTab.onSelect(commitRes)}
           class="flex cursor-default border-b"
           class:hover:bg-gray-200={commitRes !== $sGitLogTab.selected}
           class:bg-sky-300={commitRes === $sGitLogTab.selected}
      >
        <div class="w-7/12 border-r px-2">{commitRes.commit.message}</div>
        <div class="w-5/12 pl-2">{formatTime(commitRes.commit.author.timestamp)}</div>
      </div>
    {/each}
  </div>

  <!-- Selected commit files  -->
  <div>
    {#if $sGitLogTab.selected}
      <div class="p-2 font-bold">
        Modified files
      </div>
      {#each $sGitLogTab.diffs as file}
        <File {file} status={file.data.status} on:select={onSelect}/>
      {/each}
    {/if}
  </div>

</div>

<style lang="scss">

</style>
