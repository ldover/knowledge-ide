import {fromMarkdown} from "mdast-util-from-markdown";
import {mdxExpression} from "micromark-extension-mdx-expression";
import {mdxjsEsm} from "micromark-extension-mdxjs-esm";
import {mdxExpressionFromMarkdown} from "mdast-util-mdx-expression";
import {mdxjsEsmFromMarkdown} from "mdast-util-mdxjs-esm";
import * as acorn  from "acorn";
import {Parser} from "acorn";
import {map} from 'unist-util-map'

/**
 * Piggy back on MDX extensions
 * @param mdl
 */
export function parse(mdl) {
  const tree = fromMarkdown(mdl, {
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

  const next = map(tree, (node) => {
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

  return next;
}


console.log(parse('# Test heading'))