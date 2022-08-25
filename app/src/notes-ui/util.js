import Heading from "./components/Heading.svelte";
import Text from "./components/Text.svelte";
import Paragraph from "./components/Paragraph.svelte";
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
import Reference from "./components/Reference.svelte";
import Statement from "./components/Statement.svelte";
import Note from "./components/Note.svelte";

export const Components = {
  'text': {component: Text, children: false,},
  'thematicBreak': {component: ThematicBreak, children: false,},
  'break': {component: Break, children: false,},
  'blockquote': {component: Blockquote, children: true,},
  'code': {component: Code, children: false,},
  'emphasis': {component: Emphasis, children: false,},
  'inlineCode': {component: InlineCode, children: false,},
  'strong': {component: Strong, children: false,},
  'heading': {component: Heading, children: true,},
  'paragraph': {component: Paragraph, children: true,},
  'root': {component: Note, children: true,},
  'link': {component: Link, children: false,},
  'listItem': {component: ListItem, children: true,},
  'list': {component: List, children: true,},
  'notebase-image': {component: NotebaseImage, children: false,},
  'mdxTextExpression': {component: NoteReference, children: false}, // todo: this kind of works now as the only thing I use it for, but maybe ditch mdx and create custom node types component: for common children: false, patterns?
  'reference': {component: Reference, children: false,},
  'statement': {component: Statement, children: true,},
}

