import React from 'react';
import { defineMessages } from 'react-intl';

import ActionsList from '~core/ActionsList';
import { Colony } from '~data/index';

import styles from './ColonyActions.css';

// const MSG = defineMessages({
//   text: {
//     id: 'dashboard.ColonyActions.text',
//     defaultMessage: 'Text',
//   },
// });

const MOCK_ACTIONS = [
  {
    id: 1,
    title: 'Create new Domain #BDSM',
    date: 1604399689594,
    userAddress: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    domain: {
      name: 'First domain',
      id: 2,
    },
    commentCount: 0,
    statusId: 1,
  },
  {
    id: 2,
    title: 'Transfer 250000 xDai from #Dev to #Design',
    date: 1604399844229,
    userAddress: '0x9df24e73f40b2a911eb254a8825103723e13209c',
    domain: {
      name: 'Second domain',
      id: 3,
    },
    commentCount: 5,
    statusId: 2,
  },
  {
    id: 3,
    title: 'Punish @storm 500 #R&D Reputation',
    date: 1604399689594,
    userAddress: '0x27ff0c145e191c22c75cd123c679c3e1f58a4469',
    domain: {
      name: 'Third',
      id: 4,
    },
    commentCount: 4,
  },
  {
    id: 4,
    title:
      // eslint-disable-next-line max-len
      'A very very very long title, a very very very long title, a very very very long title, a very very very long title, a very very very long title, a very very very long title, a very very very long title, a very very very long title, a very very very long title',
    date: 1604399689594,
    userAddress: '0x27ff0c145e191c22c75cd123c679c3e1f58a4469',
    domain: {
      name: 'Third',
      id: 4,
    },
    commentCount: 40,
    statusId: 3,
  },
];

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyActions';

const ColonyActions = ({ colony }: Props) => {
  return (
    <div className={styles.main}>
      <ActionsList items={MOCK_ACTIONS} />
    </div>
  );
};

ColonyActions.displayName = displayName;

export default ColonyActions;
