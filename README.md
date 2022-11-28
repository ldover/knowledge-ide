# Knowledge IDE 
Work-in-progress system of tools for developing knowledge like software.

You can play with the [Web IDE](https://ide.lukadover.com) or run your local instance. With it, you can develop an article like this one: [Scaling Civilizational Knowledge](https://knowledge.lukadover.com/#/reader?repository=https%3A%2F%2Fgithub.com%2Fldover%2Fknowledge-systems) ([code](https://github.com/ldover/knowledge-systems)), and have it listed on [Knowledge Index](https://knowledge.lukadover.com).

The main idea of this framework is to split your writing project between KDL (Knowledge Definition Language) to encode concepts, and MDL (Markdown Language) to communicate them. That way you can reuse the encoded concepts in your other works.

See the "Writing and publishing" section for more information how this works.

## Project structure
Monorepo consists of two web applications:
* [Knowledge IDE](./app/README.md) — web app for developing articles
* [Knowledge Index](knowledge-index/README.md) — frontend for reading published articles

Packages:
* [KDL](./packages/kdl/README.md) — language used to encode knowledge in a pseudo-formal syntax
* [MDL](./packages/mdl/README.md) — extended Markdown Language, used to write prose and communicate ideas
* [Reader](./packages/reader/README.md) — Svelte library that renders articles
* [codemirror-lang-knowledge](./packages/reader/README.md) - codemirror plugin for KDL

*Note: this monorepo is optimized for personal Vercel deployments. It will be split into separate packages, published on NPM. Everything here is just one step from breaking, and without user-friendly error messages — it's just an early release and will change a lot.*

## Writing and publishing articles
The main idea is separating your writing project into two parts:
* Encode your concepts with [KDL](./packages/kdl/README.md), so they become reusable units of knowledge
* Communicate them with [MDL](./packages/mdl/README.md), like you would in a typical article 

You can import and reference your KDL code in MDL files, but not vice versa.

To develop an article, you'd:
1. Use [Web IDE](https://ide.lukadover.com) (or run your own instance) to develop it
2. Write KDL code to encode your main ideas
3. Write MDL prose in `index.mdl` (or break it into multiple files imported to index.mdl)
4. Publish it as a GitHub repo

That's it! In the near future we might use NPM ecosystem as well to publish knowledge libraries, and to be able to `npm install lib` and import it in your own project.

See this [published article](https://github.com/ldover/knowledge-systems)'s code as reference.

## Further work and collaboration
This is a *very* early proof of concept. As the nature of knowledge is to be open source, I wanted to bring this into public domain as soon as possible. I hope that building in public and learning aloud inspires you to pursue this crazy vision as well. If you want to fork it make it your own, feel free to do so. If you're good designing programming languages, known math or physics, or this type of thing inspires you, let me know we can collaborate.

Next step is to develop a more complete prototype: extending the KDL / MDL compilers to work with NPM ecosystem, so we can publish knowledge libraries like JS libs. If we can do `npm install <knowledge-lib>` to import others' KDL-defined knowledge into our projects, and keep a list of "dependencies" instead of article references, that would be an interesting experiment. 

**If you want to learn more or connect, please reach out: knowledge@lukadover.com.**

