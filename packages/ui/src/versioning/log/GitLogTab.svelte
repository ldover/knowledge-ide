<script>
  import {getContext, onMount} from 'svelte';
  import moment from 'moment';

  import File from '../components/File.svelte'

  const {sGitLogTab} = getContext('stores')

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
</script>

<div class="w-full flex flex-col justify-between text-sm">
  <div class="p-2 font-bold">
    Branch: {$sGitLogTab.branch}
  </div>

  <!-- Log -->
  <div class="border-t">
    {#each $sGitLogTab.logs as commitRes}
      <div on:click={() => sGitLogTab.onSelect(commitRes)}
           class="flex cursor-pointer border-b"
           class:bg-gray-100={commitRes === $sGitLogTab.selected}
      >
        <div class="w-7/12 border-r px-2">{commitRes.commit.message}</div>
        <div class="w-5/12 pl-2">{formatTime(commitRes.commit.author.timestamp)}</div>
      </div>
    {/each}
  </div>

  <!-- Selected commit files  -->
  <div>
    {#if $sGitLogTab.selected}
      {#each $sGitLogTab.diffs as file}
        <File {file}/>
      {/each}
    {/if}
  </div>

</div>

<style lang="scss">

</style>
