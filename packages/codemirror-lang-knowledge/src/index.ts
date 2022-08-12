import {parser} from "./syntax.grammar"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"

export const knowledgeLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({closing: ")", align: false})
      }),
      foldNodeProp.add({
        Application: foldInside
      }),
      styleTags({
        "symbol statement proof": t.definitionKeyword,
        "as": t.keyword,
        "use of": t.moduleKeyword,
        Identifier: t.variableName,
        NumericalIdentifier: t.variableName,
        Boolean: t.bool,
        String: t.string,
        Reference: t.variableName,
        Text: t.string,
        LineComment: t.lineComment,
        "( )": t.paren,
        "{ }": t.brace,
        MathExpression: t.special(t.variableName),
      })
    ]
  }),
  languageData: {
    commentTokens: {line: "//"},
    closeBrackets: {brackets: ["(", "[", "{", "'", '"', "`"]},
    wordChars: "§"
  }
})

export function knowledge() {
  return new LanguageSupport(knowledgeLanguage)
}
