/* @flow */
import React from 'react';

import ColonyAvatar from '../../../core/components/ColonyAvatar';
import Heading from '../../../core/components/Heading';
import Link from '../../../core/components/Link';

import styles from './UserColonyItem.css';

type Props = {
  colony: Object,
};

const UserColonyItem = ({ colony: { colonyAddress, displayName } }: Props) => (
  <div className={styles.main}>
    <Link to="/">
      <ColonyAvatar colonyAddress={colonyAddress} colonyName={displayName} />
      <Heading text={displayName} appearance={{ size: 'small' }} />
    </Link>
  </div>
);

export default UserColonyItem;
