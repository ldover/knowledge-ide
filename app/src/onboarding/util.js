import {VFile} from "vfile";

export function writeExampleRepository(sFileSystem) {
  const folders = [
    {
      files: [
        {
          name: 'README.md',
          value: `# README
This is an example repository to get you started.
See \`index.mdl\` for instructions

All files are stored locally. Connect and push to your
GitHub repository to make sure your code is saved.

Find Git button in the header and specify remote or
clone existing project.
`
        },
        {
          name: 'package.json',
          value: `{
  "name": "knowledge-project-name",
  "description": "",
  "title": "",
  "version": "0.0.1",
  "author": "",
  "license": "MIT"
}`
        },
        {
          name: 'index.mdl',
          value: `<script>
  import Energy from './src/Energy.kdl'
  import Mass from './src/Mass.kdl'

  import DemoSection from './components/DemoSection.mdl'


</script>

# Knowledge Project
This is a sample repository to demonstrate the syntax, capabilities, and limitations of this framework for developing articles.

**Caveat**: this is very early proof of concept. Things will sometimes break without user-friendly error messages. You should keep an eye on the JS console, use Git to revert to previous versions, and make heavy use of CMD+R.

## MDL — Markdown Language
MDL is Markdown with added syntax to make it more "programmable".

You can break down your project into several files and import them into this entrypoint \`index.mdl\` file using the \`script\` tag.

You can reference imported files with curly braces (e.g., {Energy}), or render them calling their \`render\` method, like this:

{DemoSection.render()}

You can also import images and KDL code.

## KDL — Knowledge Definition Language
One of the main ideas of this framework is to separate your ideas from communication. That way you might be able to reuse them in your other projects.

KDL, as a pseudo-formal language*, enables you to encode your ideas / concepts in a predictable format. You can then import them in your MDL files and explain what they're about.

You can reference individual statements ({Energy.statements[0]}), or render them:
{Energy.statements[0].render()}

You can also render raw file, like this:
{Energy.render({type: 'codemirror', lines: {to: 8}})}

This is very early PoC, but the idea is that you could also import other KDL/MDL projects as dependencies (\`npm install\`) to build out your own project. That is the next increment of this project: bootstrapping NPM ecosystem as a testing ground for building open source knowledge.

[*] *Actually, KDL is not much more than UI at this point. It checks the syntax, but it doesn't validate the actual statements. Making KDL a real programming language is a challenge in and of itself.*

## Publishing articles
Article is simply a GitHub repository. It can be read using the [Knowledge Index](https://knowledge.lukadover.com) frontend. I currently host the index, and I'll just manually update it when there are new articles.

## Learn more / Get involved
If you think this is crazy, but you're nonetheless intrigued, send me a message: knowledge@lukadover.com.

I'd welcome experienced collaborators to help me build this out — I'm more of a hacker than an engineer; I'd never done parsers/compilers before I started hacking on this project.

See [GitHub](https://github.com/ldover/knowledge-ide) repository for more information.
`
        }
      ]
    },
    {
      folder: 'components',
      files: [
        {
          name: 'DemoSection.mdl',
          value: `> This is a child component rendered in \`DemoSection.mdl\``
        }
      ]
    },
    {
      folder: 'src',
      files: [
        {
          name: 'Energy.kdl',
          value: `use Mass of './Mass.kdl'

symbol Energy

statement 1 := ({Energy} is conserved))

statement 2 := ({Energy} is equivalent to {Mass})

// You can optionally add a "proof" to your statements, by
// using existing axiomatic statements or statements
// that have already been proven.
proof §2 {
  // To reference Mass's first statement use {Mass:1}
  statement 2.1 (
    Since {Mass:1}
  )

  // Note: not actual proof of mass-energy equivalence,
  // but example how to use the syntax.
  statement 2.2 (
    QED {2}
  )
}`
        },
        {
          name: 'Mass.kdl',
          value: `use Energy of './Energy.kdl'

symbol Mass

statement 1 := ({Mass} is equivalent to {Energy})
`
        }
        ]
    }
  ]

  folders.forEach(({folder = '', files}) => {
    if (folder) {
      sFileSystem.addFolder([sFileSystem.getWorkingDir(), folder].join('/'));
    }

    files.forEach(({name, value}) => {
      let pathParts = [sFileSystem.getWorkingDir()]
      folder && pathParts.push(folder);
      pathParts.push(name);

      const vFile = new VFile({
        path: pathParts.join('/'),
        value
      });

      console.log('add', vFile)

      sFileSystem.addFile(vFile)
    })
  })
}
