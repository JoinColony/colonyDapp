/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '../Heading';
import { SpinnerLoader } from '../Preloaders';

import ColonyGridItem from './ColonyGridItem.jsx';

import styles from './ColonyGrid.css';

const MSG = defineMessages({
  title: {
    id: 'ColonyGrid.title',
    defaultMessage: 'Colonies',
  },
});

type Props = {
  /** Array of colonies to display */
  colonies: Array<{
    displayName: string,
    colonyAddress: string,
  }>,
  /** Indicates that the data is loading */
  loading: boolean,
};

const displayName = 'ColonyGrid';

const ColonyGrid = ({ colonies = [], loading }: Props) => (
  <div className={styles.main}>
    <div className={styles.sectionTitle}>
      <Heading text={MSG.title} appearance={{ size: 'medium' }} />
    </div>
    {loading ? (
      <div className={styles.loader}>
        <SpinnerLoader appearance={{ size: 'large' }} />
      </div>
    ) : (
      <div className={styles.colonyGrid}>
        {colonies.map(colony => (
          <div className={styles.colonyGridItem} key={colony.colonyAddress}>
            <ColonyGridItem colony={colony} />
          </div>
        ))}
      </div>
    )}
  </div>
);

ColonyGrid.displayName = displayName;

export default ColonyGrid;
