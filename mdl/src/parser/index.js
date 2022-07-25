import {fromMarkdown} from "mdast-util-from-markdown";
import {mdxExpression} from "micromark-extension-mdx-expression";
import {mdxjsEsm} from "micromark-extension-mdxjs-esm";
import {mdxExpressionFromMarkdown} from "mdast-util-mdx-expression";
import {mdxjsEsmFromMarkdown} from "mdast-util-mdxjs-esm";
import * as acorn  from "acorn";


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

  return tree;
}


console.log(parse('# Test heading'))