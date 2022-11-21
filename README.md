# Knowledge IDE 
Work-in-progress system of tools for developing knowledge like software.

You can use the public [IDE](https://ide.lukadover.com) to develop your article, or run your local instance. Articles can be read at [Knowledge Index](https://knowledge.lukadover.com) (like this [example](./https://knowledge.lukadover.com/#reader?repository=https%3A%2F%2Fgithub.com%2Fldover%2Fknowledge-systems)). 

See below for more instructions how to use this to write / public articles.

## Project structure
Monorepo consists of two web applications:
* [Knowledge IDE](https://ide.lukadover.com) — web app for developing articles
* [Knowledge Index](https://knowledge.lukadover.com) — frontend for reading published articles

Packages:
* [KDL](./packages/kdl/README.md) — language used to encode knowledge in a pseudo-formal syntax
* [MDL](./packages/mdl/README.md) — extended Markdown Language to communicate ideas
* [Reader](./packages/reader/README.md) — library that renders articles
* [codemirror-lang-knowledge](./packages/reader/README.md) - codemirror plugin for KDL

*Note: this monorepo is optimized for personal Vercel deployments. It will be split into separate packages, published on NPM. **Caveat**: everything here is just one step from breaking, and without user-friendly error messages — it's just an early release and will change a lot.*

## Writing and publishing articles
The main idea is separating your writing project into two parts:
* Encode your concepts with [KDL](./packages/kdl/README.md), so they become reusable units of knowledge
* Communicate them with [MDL](./packages/mdl/README.md), so others can learn what you think your KDL code means

You can import and reference your KDL code in MDL, but not vice versa.

See this [published article](https://github.com/ldover/knowledge-systems)'s code as reference.


## Further work and collaboration
This is just the PoC version exploring if this idea makes sense.

For a more rigorous test, there should be at least two such knowledge libraries on NPM, one importing the concepts (KDL code) from another, specifying `dependencies` like in our usual JavaScript projects.

The reason for bootstrapping on NPM / JS ecosystem is mainly for convenience and speed.

**If you want to write an article, if you want to help build this, or chat about these concepts, reach out: knowledge@lukadover.com.**

