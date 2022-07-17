import {
  paragraph as p,
  text as t,
  heading as h,
} from 'mdast-builder';

import {System, Statement, reference as r} from './lib/core';


// (1) Declare
let A;
let Action;


// (2) Assign
A = new Statement('A');
Action = new System('Action')

// (3) Build
A.add(
  h(2, [
    r(Action),
    t(' is movement in the Value space'),
  ])
)

Action.add(
  h(1, [
    t('Action')
  ]),
  ...A.render(),
)

// (4) Export
export {
  A,
  Action
}