<script>
  import {Node} from "../index";

  export let node;
</script>


<div class="proof">
  <div class="uppercase text-sm text-gray-600 font-medium">Proof {node.name}</div>
  {#each node.proof.statements as statement}
    <Node node={statement.render()}
          isProof={true}
          root={false}
    />
  {/each}
</div>

<style>
  .proof {
    @apply p-3 bg-gray-200 rounded-md mb-3;
  }
</style>


