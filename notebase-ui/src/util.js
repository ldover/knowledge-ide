import Heading from "./components/Heading.svelte";
import Text from "./components/Text.svelte";
import Paragraph from "./components/Paragraph.svelte";
import Note from "./components/Note.svelte";

export const Components = {
  'text': Text,
  'root': Note,
  'heading': Heading,
  'paragraph': Paragraph,
}
export function injectComponents(children) {
  children.forEach(child => {
    child.component = Components[child.type] || null;
  })

  return children;
}