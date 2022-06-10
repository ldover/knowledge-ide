import Heading from "./components/Heading.svelte";
import Text from "./components/Text.svelte";
import Paragraph from "./components/Paragraph.svelte";
import Note from "./components/Note.svelte";
import Link from "./components/Link.svelte";
import NoteReference from "./components/NoteReference.svelte";
import Emphasis from "./components/Emphasis.svelte";
import Strong from "./components/Strong.svelte";
import InlineCode from "./components/InlineCode.svelte";
import NotebaseImage from "./components/NotebaseImage.svelte";
import Code from "./components/Code.svelte";
import Blockquote from "./components/Blockquote.svelte";
import ThematicBreak from "./components/ThematicBreak.svelte";
import Break from "./components/Break.svelte";
import ListItem from "./components/ListItem.svelte";
import List from "./components/List.svelte";

export const Components = {
  'text': Text,
  'thematicBreak': ThematicBreak,
  'break': Break,
  'blockquote': Blockquote,
  'code': Code,
  'emphasis': Emphasis,
  'inlineCode': InlineCode,
  'strong': Strong,
  'root': Note,
  'heading': Heading,
  'paragraph': Paragraph,
  'link': Link,
  'listItem': ListItem,
  'list': List,
  'notebase-image': NotebaseImage,
  'mdxTextExpression': NoteReference, // todo: this kind of works now as the only thing I use it for, but maybe ditch mdx and create custom node types for common patterns?
}
export function injectComponents(children) {
  children.forEach(child => {
    child.component = Components[child.type] || null;
  })

  return children;
}