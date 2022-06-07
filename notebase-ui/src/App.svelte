<script>
    import {Notes} from './notebaseJs/index';
    import Note from "./Note.svelte";

    let note = Notes.NoteA;

    console.log('Note', {note})
</script>

<div class="p-10">
    <h1>Notebase</h1>

    <div>
        <Note note={note}/>

        <!--{#each notes as note}-->
<!--            <div class="whitespace-pre-wrap">{note.stringify()}</div>-->
<!--        {/each}-->
    </div>
</div>

<style lang="scss">

</style>
