<script>
  import {getContext} from 'svelte';
  import moment from 'moment';

  const {sGitLogTab} = getContext('stores')

  $: console.log({sGitLogTab: $sGitLogTab});

  /** @type {import('isomorphic-git').ReadCommitResult} */

  let selected;
</script>

<div class="w-full flex flex-col justify-between">
  <!-- Log -->
  <div class="border">
    {#each $sGitLogTab as commitRes}
      <div on:click={() => selected = commitRes}
           class="flex cursor-pointer"
           class:bg-gray-100={commitRes === selected}
      >
        <div class="w-6/12">{commitRes.commit.message}</div>
        <div class="w-2/12">{commitRes.commit.author.name}</div>
        <div class="w-2/12">{moment.unix(commitRes.commit.author.timestamp).fromNow()}</div>
      </div>
    {/each}
  </div>

  <!-- Selected commit files  -->
  <div class="border">
    {#if selected}
      <!--todo: use sGit.diff to get files of a selected commit-->
      <!--{#each selected.files as file}-->
      <!--  <div>{file.path}</div>-->
      <!--{/each}-->
    {/if}
  </div>

</div>

<style lang="scss">

</style>
