import fs from 'node:fs/promises'
import * as acorn from 'acorn'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {mdxExpression} from 'micromark-extension-mdx-expression'
import {mdxExpressionFromMarkdown, mdxExpressionToMarkdown} from 'mdast-util-mdx-expression'
import {mdxjsEsm} from 'micromark-extension-mdxjs-esm'
import {mdxjsEsmFromMarkdown, mdxjsEsmToMarkdown} from 'mdast-util-mdxjs-esm'
import path from "path";

const srcDir = './src';
const outDir = './notebase-ui/src/notebaseJs';

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
        if (child.type === 'mdxTextExpression') {
          // child.
        }
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


async function readImage(imagePath) {
  const baseName = path.parse(imagePath).name.replace(/\s/g, '');
  const ext = path.parse(imagePath).ext;

  const compile = (baseName, ext) => {
    return `import {NotebaseImage} from "./lib/core";

export const ${baseName} = new NotebaseImage('/notebaseJs/assets/${baseName}${ext}', '${baseName}')`
  }

  const out = compile(baseName, ext)

  return {
    id: baseName,
    title: baseName,
    outPath: path.join(outDir, 'assets', baseName + ext),
    path: imagePath,
    out
  };
}

async function readAllImages(imageFolderPath) {
  const imageDirectoryEntries = await fs.readdir(imageFolderPath, {withFileTypes: true});
  const imagePaths = imageDirectoryEntries
    .filter(entry => entry.isFile() && !entry.name.startsWith("."))
    .map(entry => path.join(imageFolderPath, entry.name));

  const imageEntries = await Promise.all(imagePaths.map(async imagePath => [imagePath, await readImage(imagePath)]));
  return Object.fromEntries(imageEntries);
}

async function readQuote(quotePath) {
  const baseName = path.parse(quotePath).name.replace(/\s/g, '');
  const ext = path.parse(quotePath).ext;

  const quoteContents = await fs.readFile(quotePath, {
    encoding: "utf-8"
  });

  const validateQuote = (quote) => {
    try {
      JSON.parse(quote);
    } catch (err) {
      throw new Error(`Quote validation failed: invalid JSON for '${quotePath}'`);
    }

    const copy = JSON.parse(quote);
    [
      {field: "value", required: true},
      {field: "author", required: false},
      {field: "reference", required: false},
    ].forEach(({field, required}) => {
      if (required && !copy[field]) {
        throw new Error(`Quote validation failed: required field '${field}' is missing from '${quotePath}'`);
      }

      delete copy[field];
    })

    // Check that there are no unspported fields — after for loop above copy obj should be empty
    for (let key in copy) {
      throw new Error(`Unexpected field '${key}' in '${quotePath}'`);
    }
  }

  validateQuote(quoteContents)

  const compile = (baseName) => {
    return `import {Quote} from "./lib/core";
import quote from '../assets/${baseName}.json';


export const ${baseName} = new Quote(quote)`
  }

  const out = compile(baseName, ext)

  return {
    id: baseName,
    title: baseName,
    outPath: path.join(outDir, 'assets', baseName + ext),
    path: quotePath,
    out
  };
}

async function readAllQuotes(quoteFolderPath) {
  const quoteDirectoryEntries = await fs.readdir(quoteFolderPath, {withFileTypes: true});
  const imagePaths = quoteDirectoryEntries
    .filter(entry => entry.isFile() && !entry.name.startsWith("."))
    .map(entry => path.join(quoteFolderPath, entry.name));

  const quoteEntries = await Promise.all(imagePaths.map(async quotePath => [quotePath, await readQuote(quotePath)]));
  return Object.fromEntries(quoteEntries);
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
      note: this,
      children: this.children
    }
  }
}`
  await fs.writeFile(path.join(outDir, 'lib', 'core.js'), noteClass);
}

async function writeImageLib() {

  const imageClass = `export class NotebaseImage {
  constructor(url, title) {
    this.url = url;
    this.title = title;
  }

  render(props = {}) {
    return {
      type: 'notebase-image',
      url: this.url,
      title: this.title,
      image: this,
      props
    }
  }
}`
  await fs.writeFile(path.join(outDir, 'images', 'lib', 'core.js'), imageClass);

}

async function writeQuoteLib() {

  const quoteClass = `import {fromMarkdown} from 'mdast-util-from-markdown'

export class Quote {
  constructor(quote) {
    this.quote = quote;
  }

  render() {
    const formatQuote = (quote) => {
        let _quote = '> "' + quote.value + '"';
        if (quote.author) _quote += " — " + quote.author;
        if (quote.reference) _quote += ", " + quote.reference;
        return _quote;
    }

    let mdast = fromMarkdown(formatQuote(this.quote));
    console.log('render() quote', {mdast})
    return {
      ...mdast.children[0],
      quote: this.quote
    }
  }
}`
  await fs.writeFile(path.join(outDir, 'quotes', 'lib', 'core.js'), quoteClass);

}

async function writeIndex(notes) {
  let noteImports = '';
  let noteLogs = '';
  let noteObj = '';
  for (let key in notes) {
    noteImports += `import {${notes[key].id}} from './${notes[key].id}';\n`
    noteLogs += `console.log('imported', ${notes[key].id})\n`
    noteObj += `\n  ${notes[key].id},`
  }

  noteObj = `export const Notes = {${noteObj}\n};` + `\n\nconsole.log({Notes})`;
  await fs.writeFile(path.join(outDir, 'index.js'), noteImports + '\n' + noteLogs + '\n' + noteObj);
}

async function writeImageIndex(notes) {
  let noteImports = '';
  let noteLogs = '';
  let noteObj = '';
  for (let key in notes) {
    noteImports += `import {${notes[key].id}} from './${notes[key].id}';\n`
    noteLogs += `console.log('imported', ${notes[key].id})\n`
    noteObj += `\n  ${notes[key].id},`
  }

  noteObj = `export const Images = {${noteObj}\n};` + `\n\nconsole.log({Images})`;
  await fs.writeFile(path.join(outDir, 'images', 'index.js'), noteImports + '\n' + noteLogs + '\n' + noteObj);
}

async function writeQuoteIndex(notes) {
  let noteImports = '';
  let noteLogs = '';
  let noteObj = '';
  for (let key in notes) {
    noteImports += `import {${notes[key].id}} from './${notes[key].id}';\n`
    noteLogs += `console.log('imported', ${notes[key].id})\n`
    noteObj += `\n  ${notes[key].id},`
  }

  noteObj = `export const Quotes = {${noteObj}\n};` + `\n\nconsole.log({Quotes})`;
  await fs.writeFile(path.join(outDir, 'quotes', 'index.js'), noteImports + '\n' + noteLogs + '\n' + noteObj);
}

/**
 * Only two rules which — (1) only alpha and decimal numbers allowed. (2) Cannot start with number
 * @param dir
 * @throws Error - if validation fails throw an error with message describing filename and how it violates the rule
 */
async function validateFileNames(dir) {
  function _validateEntry(entry) {
    if (entry.name[0].match(/[0-9]/)) {
      throw new Error(`File name cannot start with a number: ${path.join(dir, entry.name)}`);
    }

    for (let char of path.parse(entry.name).name) {
      if(!char.match(/[a-zA-z0-9]/)) {
        throw new Error(`File name must not contain any spaces, dashes, only plain alpha characters: ${entry.name}`);
      }
    }
  }
  // Validate MDL files
  const noteDirectoryEntries = await fs.readdir(dir, {withFileTypes: true});
  const notePaths = noteDirectoryEntries
    .filter(entry => entry.isFile() && !entry.name.startsWith(".") && entry.name.endsWith(".mdl"))
    .map(entry => {
      _validateEntry(entry)
    });

  // Validate image file
  const imageDirectoryEntries = await fs.readdir(path.join(dir, 'images'), {withFileTypes: true});
  const imagePaths = imageDirectoryEntries
    .filter(entry => entry.isFile() && !entry.name.startsWith("."))
    .map(entry => {
      _validateEntry(entry)
    });


  const validateQuotePath = (name) => {
    if (path.parse(name).ext !== '.json') {
      throw new Error(`Quote should be in JSON format: ${name}`);
    }
  }

  // Validate quote file
  const quoteDirectoryEntries = await fs.readdir(path.join(dir, 'quotes'), {withFileTypes: true});
  const quotePaths = quoteDirectoryEntries
    .filter(entry => entry.isFile() && !entry.name.startsWith("."))
    .map(entry => {
      validateQuotePath(entry.name)
      _validateEntry(entry)
    });
}

async function main() {
  fs.mkdir(path.join(outDir, 'lib'), { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.mkdir(path.join(outDir, 'images', 'lib'), { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.mkdir(path.join(outDir, 'quotes', 'lib'), { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.mkdir(path.join(outDir, 'assets'), { recursive: true }, (err) => {
    if (err) throw err;
  });

  validateFileNames(srcDir)

  const allNotes = await readAllNotes(srcDir)
  for (let key in allNotes) {
    await fs.writeFile(path.join(outDir, allNotes[key].id + '.js'), allNotes[key].out);
  }

  const allImages = await readAllImages(path.join(srcDir, 'images'));
  for (let key in allImages) {
    await fs.writeFile(path.join(outDir, 'images', allImages[key].id + '.js'), allImages[key].out);
    await fs.copyFile(key, allImages[key].outPath)
  }

  const allQuotes = await readAllQuotes(path.join(srcDir, 'quotes'));
  for (let key in allQuotes) {
    await fs.writeFile(path.join(outDir, 'quotes', allQuotes[key].id + '.js'), allQuotes[key].out);
    await fs.copyFile(key, allQuotes[key].outPath)
  }




  writeLib();
  writeImageLib();
  writeQuoteLib();
  writeIndex(allNotes);
  writeImageIndex(allImages);
  writeQuoteIndex(allQuotes);
}

try {
  await main();
} catch (err) {
  console.error(err)
}



