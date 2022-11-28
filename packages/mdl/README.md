# MDL - Markdown Language
Markdown with `<script>` tags to import other files and curly braces `{}` to reference imported code

You can play with it here [Web IDE](https://ide.lukadover.com).

## Syntax
Imports —
```
<script>
  import Energy from './src/Energy.kdl'
  import Mass from './src/Mass.kdl'

  import Section from './components/Section.mdl'
</script>

```

Render other files within the Markdown text:
```
## Section title
{DemoSection.render()}
```

To reference an imported object simply omit `render()`: 
```
Referencing {DemoSection}
```
