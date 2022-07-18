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
let A1;
let A2;
let B;
let Action;


// (2) Assign
A = new Statement('A');
A1 = new Statement('A1');
A2 = new Statement('A2');
B = new Statement('B');
Action = new System('Action')

// (3) Build
A1.add(
  p([
    r(Action),
    t(' is movement along the '),
    r(Value),
    t(' vector'),
  ]),
)

A2.add(
  p([
    t('Other statement to substantiate '),
    r(A),
  ]),
)

A.add(
  h(2, [
    r(Action),
    t(' is movement in the '),
    r(Value),
    t(' space'),
  ]),
  A1.render(),
  A2.render(),
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
  A1,
  B,
  Action
}