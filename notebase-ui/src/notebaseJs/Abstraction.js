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
A = new Statement(
  'A',
  h(2, [
    t('Abstraction is ' ),
    r(Action),
    t(' which maps to a Set')
  ])
);

// (3) Put them together into a System
Abstraction = new System(
  'Abstraction',
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