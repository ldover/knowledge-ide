<script>
  import Proof from "./Proof.svelte";

  export let node;
  export let isProof = false;
  export let isTooltip = false;

  let expandProof;

  function onProof(ev) {
    if (node.proven) {
      expandProof = !expandProof;
    }
  }

  console.log('Statement', node)
</script>


<div class="statement relative border border-black"
     class:isTooltip>

  <div class="flex justify-between items-center">
    <div class="statement-header">
      <div>
        {`${node.statement.root.symbol.name}: Statement ${node.name}`}
      </div>
    <!-- TODO: ADD PATH TO GITHUB      -->
      <a href="https://github.com">
        View file
      </a>
    </div>

    <!--{#if !isProof}-->
    <!--  <div class:cursor-pointer={node.proven}-->
    <!--       on:click={onProof}-->
    <!--       class:text-yellow-400={!node.proven}-->
    <!--       class:text-teal-500={node.proven}>-->
    <!--    <span class="material-symbols-sharp">{node.proven ? 'verified' : 'warning'}</span>-->
    <!--  </div>-->
    <!--{/if}-->
  </div>
  <div class="statement-body">
    <slot></slot>
  </div>

  <!--{#if expandProof}-->
  <!--  <div class="w-full mt-3">-->
  <!--    <Proof node={node.statement.proof.render()} />-->
  <!--  </div>-->
  <!--{/if}-->
</div>

<style>
  a {
    @apply text-gray-300 font-light;
  }

  .statement-header {
    @apply px-3 py-1 w-full bg-black text-white flex justify-between font-medium;
  }

  .statement-body {
    @apply p-3 bg-white;
  }

  .statement {
    @apply mb-4;
  }

  .statement.isTooltip {
    @apply mb-0;
  }
</style>


