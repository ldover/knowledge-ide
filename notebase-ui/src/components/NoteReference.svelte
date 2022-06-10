<script>
  import {sNavigation} from "../store";

  export let node;
  console.log('NoteReference', {node});
</script>

<a on:click|preventDefault|stopPropagation={() => sNavigation.navigate(node.value)}
   href="javascript:;"
   class="note-reference">
    {node.value}
</a>

