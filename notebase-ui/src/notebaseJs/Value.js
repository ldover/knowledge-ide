import {
  paragraph as p,
  text as t,
  heading as h,
} from 'mdast-builder';

import {System, Statement, reference as r} from './lib/core';


// (1) Declare
let A;
let Value;


// (2) Assign
A = new Statement('A');
Value = new System('Value')

// (3) Build
A.add(
  h(2, [
    r(Value),
    t(' is a point in the Value space'),
  ])
)

Value.add(
  h(1, [
    r(Value)
  ]),
  A.render(),
)

// todo: consider adding statements

// (4) Export
export {
  A,
  Value
}