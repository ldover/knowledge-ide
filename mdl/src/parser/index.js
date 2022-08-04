import {fromMarkdown} from "mdast-util-from-markdown";
import {mdxExpression} from "micromark-extension-mdx-expression";
import {mdxjsEsm} from "micromark-extension-mdxjs-esm";
import {mdxExpressionFromMarkdown} from "mdast-util-mdx-expression";
import {mdxjsEsmFromMarkdown} from "mdast-util-mdxjs-esm";
import * as acorn  from "acorn";
import {Parser} from "acorn";
import {map} from 'unist-util-map'

import {parse as parseKDL} from '../../../kdl/src/index.js'


/**
 * Piggy back on MDX extensions
 * @param {import('vfile').VFile[]} files
 */
export function parse(files) {
  function _parseFile(file) {
    const tree = fromMarkdown(file, {
      extensions: [
        mdxExpression({acorn, addResult: true}),
        mdxjsEsm({acorn, addResult: true})
      ],
      mdastExtensions: [
        mdxExpressionFromMarkdown,
        mdxjsEsmFromMarkdown
      ]
    })

    // Modify tree to get to MDL AST
    return map(tree, (node) => {
      if (node.type === 'html') {
        let scriptContent = node.value.substring(8, node.value.length - 9).trim();

        const parser = new Parser({
          ecmaVersion: 2016,
          sourceType: "module"
        }, scriptContent)

        return parser.parse()
      } else {
        return node;
      }
    })

  }


  files.forEach(file => {
    if (file.extname === '.mdl') {
      file.data.parsed = _parseFile(file.value);
    } else if (file.extname === '.kdl') {
      file.data.parsed = parseKDL(file.value)
    } else if (['.png', '.jpg'].includes(file.extname)) {
      // Do nothing (maybe in the future use AI to parse image into a specific AST tree objects and relations)
    } else {
      throw new Error('Unsupported file type: ' + file.path);
    }
  })

  return files;
}


