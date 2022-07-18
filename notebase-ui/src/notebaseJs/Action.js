import {
  paragraph as p,
  text as t,
  heading as h,
} from 'mdast-builder';

import {System, Statement, reference as r} from './lib/core';
import {Value} from "./Value";
import {Quality} from "./Quality";


// (1) Declare
let A;
let B;
let Action;


// (2) Assign
A = new Statement('A');
B = new Statement('B');
Action = new System('Action')

// (3) Build
A.add(
  h(2, [
    r(Action),
    t(' is movement in the '),
    r(Value),
    t(' space'),
  ])
)

B.add(
  h(2, [
    r(Action),
    t(' towards '),
    r(Value),
    t(' increases '),
    r(Quality),
  ])
)

Action.add(
  h(1, [
    r(Action)
  ]),
  A.render(),
  B.render(),
)

// todo: consider adding statements

// (4) Export
export {
  A,
  B,
  Action
}