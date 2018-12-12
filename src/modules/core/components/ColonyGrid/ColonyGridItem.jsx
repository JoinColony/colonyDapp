/* @flow */
import React from 'react';

import ColonyAvatar from '../ColonyAvatar';
import Heading from '../Heading';
import Link from '../Link';

import styles from './ColonyGridItem.css';

import type { ColonyRecord } from '~immutable';

type Props = {
  address: $PropertyType<ColonyRecord, 'address'>,
  avatar: $PropertyType<ColonyRecord, 'avatar'>,
  ensName: $PropertyType<ColonyRecord, 'ensName'>,
  name: $PropertyType<ColonyRecord, 'name'>,
};

const ColonyGridItem = ({ ensName, address, name, avatar }: Props) => (
  <div className={styles.main}>
    <Link to={`/colony/${ensName}`}>
      <ColonyAvatar avatar={avatar} address={address} name={name} />
      <Heading text={name} appearance={{ size: 'small' }} />
    </Link>
  </div>
);

export default ColonyGridItem;
