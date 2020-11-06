import React from 'react';
import { defineMessages } from 'react-intl';

import ActionsList from '~core/ActionsList';
import { Colony } from '~data/index';

import styles from './ColonyActions.css';

/*
 * @TODO Replace with actual data (fetch from events most likely?)
 */
import { MOCK_ACTIONS } from './mockData';

// const MSG = defineMessages({
//   text: {
//     id: 'dashboard.ColonyActions.text',
//     defaultMessage: 'Text',
//   },
// });

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
