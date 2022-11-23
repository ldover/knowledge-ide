# Knowledge IDE 
Work-in-progress system of tools for developing knowledge like software.

You can play with the [Web IDE](https://ide.lukadover.com) or run your local instance. You can develop an article like this [one](./https://knowledge.lukadover.com/#reader?repository=https%3A%2F%2Fgithub.com%2Fldover%2Fknowledge-systems) and have it published at [Knowledge Index](https://knowledge.lukadover.com). 

See the section below for more information on how to write and publish articles.

## Project structure
Monorepo consists of two web applications:
* [Knowledge IDE](https://ide.lukadover.com) — web app for developing articles
* [Knowledge Index](https://knowledge.lukadover.com) — frontend for reading published articles

Packages:
* [KDL](./packages/kdl/README.md) — language used to encode knowledge in a pseudo-formal syntax
* [MDL](./packages/mdl/README.md) — extended Markdown Language, used to write prose and communicate ideas
* [Reader](./packages/reader/README.md) — Svelte library that renders articles
* [codemirror-lang-knowledge](./packages/reader/README.md) - codemirror plugin for KDL

*Note: this monorepo is optimized for personal Vercel deployments. It will be split into separate packages, published on NPM. Everything here is just one step from breaking, and without user-friendly error messages — it's just an early release and will change a lot.*

## Writing and publishing articles
The main idea is separating your writing project into two parts:
* Encode your concepts with [KDL](./packages/kdl/README.md), so they become reusable units of knowledge
* Communicate them with [MDL](./packages/mdl/README.md), so others can learn what you think your KDL code means

You can import and reference your KDL code in MDL, but not vice versa.

See this [published article](https://github.com/ldover/knowledge-systems)'s code as reference.

## Further work and collaboration
This is a *very* early proof of concept, designed to bring the project into public view and begin learning. While developing articles with this framework is certainly interesting, the technology will change many times, and consequently the articles will need to be refactored.

Next step is to develop a more complete prototype: publishing several inter-linked articles or knowledge libraries, bootstrapping on NPM / JS ecosystem for convenience and speed. 

**If you want to learn more or write an article, if you want to help build this technology, if you want to chat about these concepts, reach out: knowledge@lukadover.com.**

