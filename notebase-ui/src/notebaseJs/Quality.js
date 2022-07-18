import {
  paragraph as p,
  text as t,
  heading as h,
} from 'mdast-builder';

import {System, Statement, reference as r} from './lib/core';
import {Action} from "./Action";
import {Value} from "./Value";


// (1) Declare
let A;
let Quality;


// (2) Assign
A = new Statement('A');
Quality = new System('Quality')

// (3) Build
A.add(
  h(2, [
    r(Quality),
    t(' is '),
    t('Action'),
    t(' towards'),
    r(Value),
  ])
)

Quality.add(
  h(1, [
    r(Quality)
  ]),
  A.render(),
)

// todo: consider adding statements

// (4) Export
export {
  A,
  Quality
}