<script>
  import {onMount, afterUpdate} from 'svelte';
  import {Diff2HtmlUI} from 'diff2html/lib/ui/js/diff2html-ui'
  import * as Diff from 'diff'

  const configuration = {drawFileList: false, matching: 'lines'};

  export let file;
  export let sGit;

  let prevFile;
  let el;

  afterUpdate(async () => {
    if (file === prevFile) return;
    prevFile = file;

    if (!file) return;


    let oldString = '';
    const newString = file.value;
    try {
      const f = await sGit.getLatest(file);
      oldString = f.value
    } catch(err) {
      console.error(err) // handle file not found case where we searc for a new file in git — meaning.
    }

    // Creates a unified diff patch.
    console.log({s0: newString, s1: oldString})
    const patch = Diff.createTwoFilesPatch(file.path, file.path, oldString, newString);
    console.log({el, patch, configuration})

    const diff2htmlUi = new Diff2HtmlUI(el, patch, configuration);
    diff2htmlUi.draw();
  })

  onMount(async () => {

  })
</script>

<div class="w-full h-full" bind:this={el}>

</div>

<style lang="scss">

</style>
