<script>
    import {Notes} from './notebaseJs/index';
    import Node from "./components/Node.svelte";
    import Note from "./components/Note.svelte";

    let note = Notes.NoteA;

    console.log('Note', {note})
</script>

<div class="p-10">
    <h1>Notebase</h1>

    <div>
        <Node node={note.render()}/>
    </div>
</div>

<style lang="scss">

</style>
