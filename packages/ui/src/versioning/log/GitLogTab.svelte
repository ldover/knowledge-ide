<script>
  import {getContext} from 'svelte';
  import moment from 'moment';

  import File from '../components/File.svelte'

  const {sGitLogTab} = getContext('stores')
</script>

<div class="w-full flex flex-col justify-between">
  <!-- Log -->
  <div class="border">
    {#each $sGitLogTab.logs as commitRes}
      <div on:click={() => sGitLogTab.onSelect(commitRes)}
           class="flex cursor-pointer"
           class:bg-gray-100={commitRes === $sGitLogTab.selected}
      >
        <div class="w-6/12">{commitRes.commit.message}</div>
        <div class="w-2/12">{commitRes.commit.author.name}</div>
        <div class="w-2/12">{moment.unix(commitRes.commit.author.timestamp).fromNow()}</div>
      </div>
    {/each}
  </div>

  <!-- Selected commit files  -->
  <div class="border">
    {#if $sGitLogTab.selected}
      {#each $sGitLogTab.diffs as file}
        <File {file}/>
      {/each}
    {/if}
  </div>

</div>

<style lang="scss">

</style>
