<script>
  import {sNavigation, sNotes} from "../store";

  export let node;
  console.log('NoteReference', {node});
</script>

<a on:click|preventDefault|stopPropagation={() => sNavigation.navigate(node.value)}
   href="javascript:;"
   class="note-reference">
    {$sNotes[node.value].children[0].children[0].value}
</a>

