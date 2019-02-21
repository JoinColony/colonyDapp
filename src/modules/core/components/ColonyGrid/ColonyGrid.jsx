/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import { compose } from 'recompose';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withColonies } from '../../../dashboard/hocs';

import Heading from '../Heading';

import ColonyGridItem from './ColonyGridItem.jsx';

import styles from './ColonyGrid.css';

import type { ColonyType } from '~immutable';

const MSG = defineMessages({
  title: {
    id: 'ColonyGrid.title',
    defaultMessage: 'Colonies',
  },
});

type Props = {|
  /** List of colonies to display */
  colonies: Array<ColonyType>,
|};

const displayName = 'ColonyGrid';

const ColonyGrid = ({ colonies = [] }: Props) => (
  <div className={styles.main}>
    <div className={styles.sectionTitle}>
      <Heading text={MSG.title} appearance={{ size: 'medium' }} />
    </div>
    <div className={styles.colonyGrid}>
      {colonies.map(({ ensName, address, name, avatar }) => (
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

export default compose(
  withColonies,
  withImmutablePropsToJS,
)(ColonyGrid);
