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
      {/* Once the colonies are persisted, use withDataReducer */}
      {colonies
        .filter(({ record }) => !!record)
        .map(({ record: colony }) => (
          // $FlowFixMe I think we'll be handling this properly once this is wired, probably on a selector level
          <div className={styles.colonyGridItem} key={colony.address}>
            <ColonyGridItem
              // $FlowFixMe see above
              colony={colony}
            />
          </div>
        ))}
    </div>
  </div>
);

ColonyGrid.displayName = displayName;

export default ColonyGrid;
