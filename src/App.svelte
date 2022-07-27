<script>


  import FileTree from "./FileTree.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import NewFileModal from "./modal/NewFileModal.svelte";
  import Resizer from "./Resizer.svelte";
  import {Node} from "./notes-ui"
  import {parse} from "../mdl/src/index"
  import {parse as parseKDL} from "../kdl/src/index"
  import {onMount} from "svelte";
  import {sEditor} from "./store";

  console.log({parse, parseKDL})

  const note = {
    "type": "note",
    "children": [
      {
        "type": "heading",
        "depth": 1,
        "children": [
          {
            "type": "text",
            "value": "Knowledge language",
          }
        ],
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "value": "Knowledge language is a programming language for ",
          },
          {
            "type": "reference",
            "title": "Knowledge",
            "url": "Knowledge",
          }
        ],
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "value": "It abstracts away all the low-level operations like parsing the knowledge program and compiling it down to computable set of instructions, so the user (a knowledge engineer) can focus on the high-level tasks instead of manually traversing the graph of relations and abstractions for every simple statement or algorithm.",
          }
        ],
      },
      {
        "type": "blockquote",
        "children": [
          {
            "type": "paragraph",
            "children": [
              {
                "type": "text",
                "value": "Here's one quote",
              }
            ],
          }
        ],
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "strong",
            "children": [
              {
                "type": "text",
                "value": "For example, to evaluate the statement",
              }
            ],
          },
          {
            "type": "text",
            "value": " “The Sky is Blue”, we’d write  ",
          },
          {
            "type": "inlineCode",
            "value": "Sky.is(Blue)",
          },
          {
            "type": "text",
            "value": " and the program would return a boolean. But what happens under the hood is (1)  a parser turns into Abstract Syntax Tree (AST) , and (2) [[Knowledge compiler]] optimizes it and turns the AST into executable set of instructions for the CPU.",
          }
        ],
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "emphasis",
            "children": [
              {
                "type": "text",
                "value": "Knowledge language algorithms",
              }
            ],
          },
          {
            "type": "text",
            "value": " might run on instances of a particular set of [[Abstraction]]s that are stored in the [[Knowledge databases]]. That way it’s degrees of freedom aren’t constrained to static knowledge definitions, but are expanded to infinite with (now unimaginable) data streams.",
          }
        ],
      }
    ]
  }


  let eFrame;
  onMount(() => {
    eFrame.height = window.innerHeight;
  })

  $: noteName = $sEditor.file?.name?.split('.')[0];
  $: console.log({noteName, file: $sEditor.file})
</script>

<div class="w-full flex h-full overflow-x-hidden">
    <div class="w-3/12 bg-gray-100 overflow-x-auto">
        <FileTree/>
    </div>
    <Resizer/>
    <div class="w-5/12 h-fullvw">
        <CodeMirror/>
    </div>
    <Resizer/>
    <div class="h-full h-fullvw w-4/12">
        <Node node={note} />
    </div>
</div>

<ContextMenu/>
<NewFileModal/>

<style lang="scss">
  .h-fullvw {
    height: 100vh;
  }

</style>
