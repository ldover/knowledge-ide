import fs from 'node:fs/promises'
import * as acorn from 'acorn'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {mdxExpression} from 'micromark-extension-mdx-expression'
import {mdxExpressionFromMarkdown, mdxExpressionToMarkdown} from 'mdast-util-mdx-expression'
import {mdxjsEsm} from 'micromark-extension-mdxjs-esm'
import {mdxjsEsmFromMarkdown, mdxjsEsmToMarkdown} from 'mdast-util-mdxjs-esm'
import path from "path";

const srcDir = './src';
const outDir = './notebaseJs';

function compile(tree, baseName) {
  const classTemplate = (name, children) => `export const ${name.replace(' ', '')} = new Note(${compileChildren(children)});`

  const extractImports = (tree) => tree.children
    .filter(({type}) => type === 'mdxjsEsm')
    .map(node => node.value.endsWith(';') ? node.value : node.value + ';')
    .join('\n') || '';

  const fileTemplate = (tree, fileName, imports) => {
    const baseImports = `import {Note} from './lib/core';`
    imports = baseImports + (imports ? '\n' + imports : '') + '\n\n';
    return `${imports}${classTemplate(fileName, tree)}`;
  }

// This function is outside the
  function compileChildren() {
    let compiled = [];
    tree.children.forEach(child => {
      if (child.type === "mdxFlowExpression") {
        compiled.push(child.value)
      } else if (child.type === 'mdxjsEsm') {
        // skip imports
      } else {
        compiled.push(JSON.stringify(child, null, 2));
      }
    })
    return `[\n${compiled.join(',\n')}\n]`
  }



  return fileTemplate(tree, baseName, extractImports(tree));
}

/**
 *
 * @param {string} notePath
 * @return {Promise<Note>}
 */
async function readNote(notePath) {
  const noteContents = await fs.readFile(notePath, {
    encoding: "utf-8"
  });

  const tree = fromMarkdown(noteContents, {
    extensions: [mdxExpression({acorn, addResult: true}), mdxjsEsm({acorn, addResult: true})],
    mdastExtensions: [mdxExpressionFromMarkdown, mdxjsEsmFromMarkdown]
  })

  const baseName = path.parse(notePath).name.replace(/\s/g, '');

  const out = compile(tree, baseName)

  return {
    id: baseName,
    title: baseName,
    tree,
    out
  };
}

/**
 *
 * @param {string} noteFolderPath
 * @return {Promise<Object>}
 */
async function readAllNotes(noteFolderPath) {
  const noteDirectoryEntries = await fs.readdir(noteFolderPath, {withFileTypes: true});
  const notePaths = noteDirectoryEntries
    .filter(entry => entry.isFile() && !entry.name.startsWith(".") && entry.name.endsWith(".mdl"))
    .map(entry => path.join(noteFolderPath, entry.name));

  const noteEntries = await Promise.all(notePaths.map(async notePath => [notePath, await readNote(notePath)]));
  return Object.fromEntries(noteEntries);
}


async function writeLib() {
  const noteClass = `import {toMarkdown} from "mdast-util-to-markdown"

export class Note {
  constructor(children) {
    this.children = children;
  }

  stringify() {
    return toMarkdown({
      type: 'root',
      children: this.children
    })
  }

  render() {
    return {
      type: 'root',
      children: this.children
    }
  }
}`
  await fs.writeFile(path.join(outDir, 'lib', 'core.js'), noteClass);
}

async function writeIndex(notes) {
  let noteImports = '';
  for (let key in notes) {
    noteImports += `import {${notes[key].id}} from './${notes[key].id}';\n`
  }

  let noteLogs = '';
  for (let key in notes) {
    noteLogs += `console.log('imported', ${notes[key].id})\n`
  }

  await fs.writeFile(path.join(outDir, 'index.js'), noteImports + '\n' + noteLogs);
}

async function main() {
  fs.mkdir('./notebaseJs/lib', { recursive: true }, (err) => {
    if (err) throw err;
  });

  const allNotes = await readAllNotes(srcDir)
  for (let key in allNotes) {
    await fs.writeFile(path.join(outDir, allNotes[key].id + '.js'), allNotes[key].out);
  }

  writeLib();
  writeIndex(allNotes);

}

await main();



