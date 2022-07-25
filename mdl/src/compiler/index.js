import fs from "node:fs/promises";
import {fromMarkdown} from "mdast-util-from-markdown";
import {mdxExpression} from "micromark-extension-mdx-expression";
import * as acorn from "acorn";
import {mdxjsEsm} from "micromark-extension-mdxjs-esm";
import {mdxExpressionFromMarkdown} from "mdast-util-mdx-expression";
import {mdxjsEsmFromMarkdown} from "mdast-util-mdxjs-esm";
import path from "path";
import {remove} from "unist-util-remove";


async function compile(notePath) {

  function _compile(tree, baseName) {
    const classTemplate = (name, children) => `export const ${name.replace(' ', '')} = new Note(${compileChildren(children)});`

    const extractImports = (tree) => {
      if (tree.children[0].type === 'html') {
        return tree.children["0"].value.substring(8, tree.children["0"].value.length - 9);
      }

      return '';
    }

    const fileTemplate = (tree, fileName, imports) => {
      const baseImports = `import {Note} from './lib/core';`
      imports = baseImports + (imports ? '\n' + imports : '') + '\n\n';
      return `${imports}${classTemplate(fileName, tree)}`;
    }

// This function is outside the
    function compileChildren() {
      // Iterate over the children following
      /**
       * 1. Go through the top-level nodes i..N
       * 2. When you find second level heading search ahead and include all the nodes until the next second level heading into the `NoteContent`
       * 3. **Bonus:** When you encounter a line break or something stop the process and create NoteContent with gathered nodes so far. Then continue the search until encountering next second level heading
       */

      let compiled = [];
      let foundChildren = [];
      let nesting = false;
      tree.children.forEach(child => {
        if (child.type === 'heading' && child.depth === 2) {
          if (nesting) {
            // (1) Stop and create NoteContent
            // (2) Put it into the compiled
            nesting = false;
            compiled.push(new NoteContent(foundChildren))
            foundChildren = []
          } else {
            // (1) Start nesting
            nesting = true;
          }
        }

        if (child.type === "mdxFlowExpression") {
          foundChildren.push(child.value)
        } else if (child.type === 'mdxjsEsm') {
          // skip imports
        } else {
          if (child.type === 'mdxTextExpression') {
            // child.
          }
          foundChildren.push(JSON.stringify(child, null, 2));
        }
      })
      return `[\n${compiled.join(',\n')}\n]`
    }


    let extractedScript = extractImports(tree);
    remove(tree, 'html')
    return fileTemplate(tree, baseName, extractedScript);
  }

  const noteContents = await fs.readFile(notePath, {
    encoding: "utf-8"
  });

  const tree = fromMarkdown(noteContents, {
    extensions: [mdxExpression({acorn, addResult: true}), mdxjsEsm({acorn, addResult: true})],
    mdastExtensions: [mdxExpressionFromMarkdown, mdxjsEsmFromMarkdown]
  })

  const baseName = path.parse(notePath).name.replace(/\s/g, '');

  const out = _compile(tree, baseName)

  return {
    id: baseName,
    title: baseName,
    tree,
    out
  };
}

export {compile}
