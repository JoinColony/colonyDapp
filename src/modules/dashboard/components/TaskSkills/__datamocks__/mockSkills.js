/* @flow */

import { List } from 'immutable';

import { Skill } from '~immutable';

const skillMocks = List.of(
  Skill({
    id: 0,
    name: 'Daily Standup',
  }),
  Skill({
    id: 10,
    name: 'Design',
    parent: 0,
  }),
  Skill({
    id: 11,
    name: 'Dev',
    parent: 0,
  }),
  Skill({
    id: 110,
    name: 'Hackathon',
    parent: 11,
  }),
  Skill({
    id: 111,
    name: 'Javascript',
    parent: 11,
  }),
  Skill({
    id: 1,
    name: 'Random',
  }),
  Skill({
    id: 20,
    name: 'Time Off',
    parent: 1,
  }),
  Skill({
    id: 21,
    name: 'Website',
    parent: 1,
  }),
  Skill({
    id: 1110,
    name: 'Strings',
    parent: 111,
  }),
  Skill({
    id: 1111,
    name: 'Objects',
    parent: 111,
  }),
  Skill({
    id: 1112,
    name: 'Arrays',
    parent: 111,
  }),
);

export default skillMocks;
