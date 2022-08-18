<script>
  import {onMount} from 'svelte';
  import {Diff2HtmlUI} from 'diff2html/lib/ui/js/diff2html-ui'
  import * as Diff from 'diff'

  const configuration = {drawFileList: false, matching: 'lines'};

  export let file;
  export let sGit;
  let el;

  onMount(async () => {
    const s0 = file.value;

    const f = await sGit.getLatest(file);
    debugger
    const s1 = f.value;
    // Creates a unified diff patch.

    console.log({s0, s1})
    const patch = Diff.createTwoFilesPatch(file.path, file.path, s0, s1);
    console.log({el, patch, configuration})

    const diff2htmlUi = new Diff2HtmlUI(el, patch, configuration);

    diff2htmlUi.draw();
  })
</script>

<div class="w-full h-full" bind:this={el}>

</div>

<style lang="scss">

</style>
