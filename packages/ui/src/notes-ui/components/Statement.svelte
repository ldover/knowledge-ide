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

  $: console.log('Statement.svelte', node)
</script>


<div class="statement relative">

  <div class="flex justify-between items-baseline">
    <div class="font-medium">Statement {node.name}</div>

    {#if !isProof}
      <div class:cursor-pointer={node.proven}
           on:click={onProof}
           class:text-orange-500={!node.proven}
           class:text-teal-500={node.proven}>
        <span class="material-symbols-sharp">{node.proven ? 'verified' : 'question_mark'}</span>
      </div>
    {/if}
  </div>
  <slot></slot>

  {#if expandProof}
    <Proof node={node.statement.proof.render()} />
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


