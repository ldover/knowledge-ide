<script>
  import {basicSetup, EditorView} from "codemirror"
  import {markdown} from "@codemirror/lang-markdown"
  import {languages} from "@codemirror/language-data"
  import {onMount} from "svelte";

  let el

  onMount(() => {
      // The Markdown parser will dynamically load parsers
      // for code blocks, using @codemirror/language-data to
      // look up the appropriate dynamic import.
      let view = new EditorView({
        doc: "Hello\n\n```javascript\nlet x = 'y'\n```",
        extensions: [
          basicSetup,
          markdown({codeLanguages: languages})
        ],
        parent: el
      })
  })

</script>

<div bind:this={el}
     class="h-full"
>

</div>

<style lang="scss">

</style>
