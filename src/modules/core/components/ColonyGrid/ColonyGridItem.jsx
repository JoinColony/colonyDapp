/* @flow */
import React from 'react';

import ColonyAvatar from '../ColonyAvatar';
import Heading from '../Heading';
import Link from '../Link';

import styles from './ColonyGridItem.css';

import type { ColonyRecord } from '~immutable';

type Props = {
  colony: ColonyRecord,
};

const ColonyGridItem = ({ colony }: Props) => (
  <div className={styles.main}>
    <Link to={`/colony/${colony.ensName}`}>
      <ColonyAvatar colony={colony} />
      <Heading text={colony.name} appearance={{ size: 'small' }} />
    </Link>
  </div>
);

export default ColonyGridItem;
