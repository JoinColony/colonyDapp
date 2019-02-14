/* @flow */
import React from 'react';

import ColonyAvatar from '../ColonyAvatar';
import Heading from '../Heading';
import Link from '../Link';

import styles from './ColonyGridItem.css';

import type { ColonyType } from '~immutable';

type Props = {|
  address: $PropertyType<ColonyType, 'address'>,
  avatar: $PropertyType<ColonyType, 'avatar'>,
  ensName: $PropertyType<ColonyType, 'ensName'>,
  name: $PropertyType<ColonyType, 'name'>,
|};

const ColonyGridItem = ({ ensName, address, name, avatar }: Props) => (
  <div className={styles.main}>
    <Link to={`/colony/${ensName}`}>
      <ColonyAvatar
        address={address}
        avatar={avatar}
        ensName={ensName}
        name={name}
      />
      <Heading text={name} appearance={{ size: 'small' }} />
    </Link>
  </div>
);

export default ColonyGridItem;
