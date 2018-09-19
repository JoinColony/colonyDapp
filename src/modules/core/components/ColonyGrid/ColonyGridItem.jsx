/* @flow */
import React from 'react';

import ColonyAvatar from '../ColonyAvatar';
import Heading from '../Heading';
import Link from '../Link';

import styles from './ColonyGridItem.css';

type Props = {
  colony: {
    colonyAddress: string,
    displayName: string,
  },
};

const ColonyGridItem = ({ colony: { colonyAddress, displayName } }: Props) => (
  <div className={styles.main}>
    <Link to="/">
      <ColonyAvatar colonyAddress={colonyAddress} colonyName={displayName} />
      <Heading text={displayName} appearance={{ size: 'small' }} />
    </Link>
  </div>
);

export default ColonyGridItem;
