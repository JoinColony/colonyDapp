/* @flow */

const skillMocks = [
  {
    id: 0,
    name: 'Daily Standup',
  },
  {
    id: 10,
    name: 'Design',
    parent: 0,
  },
  {
    id: 11,
    name: 'Dev',
    parent: 0,
  },
  {
    id: 110,
    name: 'Hackathon',
    parent: 11,
  },
  {
    id: 111,
    name: 'Javascript',
    parent: 11,
  },
  {
    id: 1,
    name: 'Random',
  },
  {
    id: 20,
    name: 'Time Off',
    parent: 1,
  },
  {
    id: 21,
    name: 'Website',
    parent: 1,
  },
  {
    id: 1110,
    name: 'Strings',
    parent: 111,
  },
  {
    id: 1111,
    name: 'Objects',
    parent: 111,
  },
  {
    id: 1112,
    name: 'Arrays',
    parent: 111,
  },
];

export default skillMocks;
