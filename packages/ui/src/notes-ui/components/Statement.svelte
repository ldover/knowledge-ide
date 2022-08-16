<script>
  import Proof from "./Proof.svelte";

  export let node;
  export let root;
  export let isProof = false;

  let expandProof;

  // todo: might have to afterUpdate this and reset expandProof if node changed
  function onProof(ev) {
    if (node.proven) {
      expandProof = !expandProof;
    }
  }
</script>


<div class="statement relative">

  <div class="flex justify-between items-center">
    <div class="uppercase text-sm text-gray-600 font-medium">
      {!isProof ? `Statement ${node.name}` : node.name}
    </div>

    {#if !isProof}
      <div class:cursor-pointer={node.proven}
           on:click={onProof}
           class:text-yellow-400={!node.proven}
           class:text-teal-500={node.proven}>
        <span class="material-symbols-sharp">{node.proven ? 'verified' : 'warning'}</span>
      </div>
    {/if}
  </div>
  <slot></slot>

  {#if expandProof}
    <div class="w-full mt-3">
      <Proof node={node.statement.proof.render()} />
    </div>
  {/if}
</div>

<style>
  .statement {
    @apply p-3 bg-gray-100 rounded-md mb-3;
  }
    .note-handle {
        top: 0;
        right: 0;
    }

</style>


