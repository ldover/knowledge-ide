import {
  paragraph as p,
  text as t,
  heading as h,
} from 'mdast-builder';

import {System, Statement} from './lib/core';


// (1) Declare
let A;
let Abstraction;


// (2) Assign individual Statements
A = new Statement(
  h(2, [
    t('Abstraction is Action which maps to a Set')
  ])
);

// (3) Put them together into a System
Abstraction = new System(
  h(1, [
    t('Abstraction')
  ]),
  [
    A,
  ]
)


// (4) Export
export {
  A,
  Abstraction
}