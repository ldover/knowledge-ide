import Heading from "./components/Heading.svelte";
import Text from "./components/Text.svelte";
import Paragraph from "./components/Paragraph.svelte";
import Note from "./components/Note.svelte";
import Link from "./components/Link.svelte";
import NoteReference from "./components/NoteReference.svelte";

export const Components = {
  'text': Text,
  'root': Note,
  'heading': Heading,
  'paragraph': Paragraph,
  'link': Link,
  'mdxTextExpression': NoteReference, // todo: this kind of works now as the only thing I use it for, but maybe ditch mdx and create custom node types for common patterns?
}
export function injectComponents(children) {
  children.forEach(child => {
    child.component = Components[child.type] || null;
  })

  return children;
}