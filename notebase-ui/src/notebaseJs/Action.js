import {
  paragraph as p,
  text as t,
  heading as h,
} from 'mdast-builder';

import {System, Statement} from './lib/core';


// (1) Declare
let A;
let Action;


// (2) Assign individual Statements
A = new Statement(
  'A',
  h(2, [
    t('Action is movement in the Value space')
  ])
);

// (3) Put them together into a System
Action = new System(
  'Action',
  h(1, [
    t('Action')
  ]),
  [
    A,
  ]
)


// (4) Export
export {
  A,
  Action
}