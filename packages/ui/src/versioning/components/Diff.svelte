<script>
  import {onMount} from 'svelte';
  import {Diff2HtmlUI} from 'diff2html/lib/ui/js/diff2html-ui'
  import * as Diff from 'diff'

  const configuration = {drawFileList: false, matching: 'lines'};

  export let s0;
  export let s1;

  $: diffString = Diff.diffWords(s0, s1)

  let el;

  onMount(() => {
    // - creates a unified diff patch.
    const patch = Diff.createTwoFilesPatch('a.mdl', 'a.mdl', s0, s1);
    console.log({el, patch, configuration})

    const diff2htmlUi = new Diff2HtmlUI(el, patch, configuration);

    diff2htmlUi.draw();
  })
</script>

<div class="w-full h-full" bind:this={el}>

</div>

<style lang="scss">

</style>
