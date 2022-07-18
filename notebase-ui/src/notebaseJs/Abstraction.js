import {
  paragraph as p,
  text as t,
  heading as h,
} from 'mdast-builder';

import {System, Statement, reference as r} from './lib/core';
import {Action} from "./Action";


// (1) Declare
let A;
let Abstraction;


// (2) Assign individual Statements
A = new Statement('A');
Abstraction = new System('Abstraction')

A.add(
  h(2, [
    r(Abstraction),
    t(' is '),
    r(Action),
    t(' which maps to a Set')
  ])
)
Abstraction.add(
  h(1, [
    r(Abstraction),
  ]),
  A.render(),
)

// (3) Put them together into a System


// (4) Export
export {
  A,
  Abstraction
}