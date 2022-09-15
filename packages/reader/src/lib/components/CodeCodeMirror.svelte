<script>
  import {onMount} from "svelte";
  import {basicSetup, EditorView} from "codemirror";
  import {knowledge} from "@knowledge/codemirror-lang-knowledge";

  export let node;

  function init(el) {
    node.view?.destroy();

    let config = {
      "&": {
        color: "black",
        backgroundColor: "#ffffff"
      },
      ".cm-content": {
        caretColor: "#0e9",
        fontFamily: "Roboto Mono",
        fontWeight: 300
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: "#0e9"
      },
      "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "#074"
      },
      ".ͼ7": {
        fontSize: '20px',
        textDecoration: 'none',
      },
      ".cm-activeLineGutter": {
        backgroundColor: 'transparent',
        color: "#005a57",
      },
      ".cm-gutters": {
        minWidth: "36px",
        backgroundColor: "transparent",
        color: "#009c97",
        border: "none"
      },
      ".cm-gutterElement": {
        display: "flex",
        alignItems: "center"
      }
    };


    let myTheme = EditorView.theme(config, {dark: false})


    let extensions = [
      basicSetup,
      myTheme,
      EditorView.editable.of(false)
    ];


    extensions = [
      ...extensions,
      knowledge(),
    ]

    node.view = new EditorView({
      doc: node.value,
      extensions,
      parent: el
    });
  }


  onMount(() => {
    init(node.el);
  })
</script>

<div class="relative mb-3">
  <div bind:this={node.el}
       class="h-full">
  </div>
  <div class="font-normal bg-gray-100 roboto-mono text-xs text-gray-700 py-1 flex justify-between px-2">
    <div class="">{node.path}</div>
    <!-- TODO: make this into link pointing to actual repo (maybe path above is clickable too?)  -->
    <div class="">
      View on Github
    </div>
  </div>
</div>

<style>
  .roboto-mono {
    font-family: 'Roboto Mono', monospace;
  }
</style>
