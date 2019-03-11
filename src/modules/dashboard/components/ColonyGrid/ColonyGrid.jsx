/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { ColonyType, DataType } from '~immutable';
import Heading from '~core/Heading';

import ColonyGridItem from './ColonyGridItem.jsx';

import styles from './ColonyGrid.css';

const MSG = defineMessages({
  title: {
    id: 'ColonyGrid.title',
    defaultMessage: 'Colonies',
  },
});

type Props = {|
  /** List of colonies to display */
  colonies: Array<DataType<ColonyType>>,
|};

const displayName = 'ColonyGrid';

const ColonyGrid = ({ colonies = [] }: Props) => (
  <div className={styles.main}>
    <div className={styles.sectionTitle}>
      <Heading text={MSG.title} appearance={{ size: 'medium' }} />
    </div>
    <div className={styles.colonyGrid}>
      {/* Once the colonies are persisted, we need to use withDataReducer and useDataFetcher
        I don't want to deal with this right now
        $FlowFixMe */}
      {colonies.map(({ record: { ensName, address, name, avatar } }) => (
        <div className={styles.colonyGridItem} key={address}>
          <ColonyGridItem
            address={address}
            avatar={avatar}
            ensName={ensName}
            name={name}
          />
        </div>
      ))}
    </div>
  </div>
);

ColonyGrid.displayName = displayName;

export default ColonyGrid;
