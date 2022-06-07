import Heading from "./components/Heading.svelte";
import Text from "./components/Text.svelte";
import Paragraph from "./components/Paragraph.svelte";

const Components = {
  'text': Text,
  'heading': Heading,
  'paragraph': Paragraph,
}
export function injectComponents(children) {
  children.forEach(child => {
    child.component = Components[child.type] || null;
  })

  return children;
}