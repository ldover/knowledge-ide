# KDL - Knowledge Definition Language
Proof of concept programming language for knowledge.

Unlike query languages, like SPARQL and SHACL, which define data structures and queries, KDL defines concepts and remains a purely abstract language, without any data associated with it. Since it can't be used to enter data, or manipulate it in any way, it's not useful for the same types of applications as query languages. Its aim is to enable us to define, design, and engineer knowledge itself — knowledge, which might then be used as a conceptual layer for various things, including defining data structures and queries for SPARQL and other languages.  

The idea for a programming language for knowledge comes from an observation that explicit knowledge is always encoded with series of symbols and statements, representing concepts and concept descriptions respectively. Symbols (concepts) can only be defined in relation to one another with statements, and statements are built on other statements to further describe a symbol or form a new one.  

KDL language is at present just a UI that enforces these constraints — you can define symbols, statements, and that's pretty much it. But it has no way of doing actual computation and validation of statements. Yet.

The eventual goal is to create a real programming language, where we can compile high level statements to a general, mathematical representation and evaluate individual knowledge statements just as we evaluate statements of C++ or JavaScript.

Let me know if you have any ideas how to approach that.

## Syntax
Far from finished, the language has two main keywords: `statement`, `symbol`.

To create a concept, create the corresponding file, like `Energy.kdl` and describe it with statements:
```
use Mass of './Mass.kdl'

symbol Energy

statement 1 := ({Energy} is conserved)) 

statement 2 := ({Energy} equals {Mass}) 
```

You can "prove" individual statements: 
```

// Derive energy from mass
proof §2 {
  // To reference Mass's first statement use {Mass:1}
  statement 2.1 (
    Since {Mass:1}
  )

  // Note: not actual proof of mass-energy equivalence,
  // just an example how to use the syntax.
  statement 2.2 (
    QED {2}
  )
}
```
