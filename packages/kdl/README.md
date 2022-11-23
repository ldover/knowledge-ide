# KDL - Knowledge Definition Language
This is little more than a proof of concept of what the programming language for knowledge might look like.

The idea comes from an observation that explicit knowledge is always encoded with series of symbols and statements, representing concepts and concept descriptions respectively. Symbols (concepts) can only be defined in relation to one another with statements, and statements are built on other statements to further describe a symbol or form a new one.  

KDL language is at present just a UI that enforces these constraints, it has no power to do actual computation and validation of statements. Even so, as a user interface imposing these constraints on one's thinking, it can be a useful environment for developing ideas.

In the future we might find a way to compile KDL code to a general, mathematical representation and check individual statements for validity.

## Syntax
Far from finished, the language has two main keywords: `statement`, `symbol`.

To create a concept, create corresponding file, like `Energy.kdl` and describe it with statements:
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
  statement 1.1 (
    // Step 1
  )
  
   statement 1.2 (
    // Step 2 
  )
  
  // etc.
}
```


## Potential use case
I can imagine a use case where KDL forms a backbone of research articles.   

As long as the findings are explicit (like a new physics equation construct), they could in principle be encoded with KDL and imported into other research projects. Like open source software, research projects would have "dependencies" on other projects.

