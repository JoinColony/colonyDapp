/* @flow */

import React from 'react';

import ColonyAvatar from '~core/ColonyAvatar';
import Heading from '~core/Heading';
import Link from '~core/Link';

import styles from './ColonyGridItem.css';

import type { ColonyType } from '~immutable';

type Props = {|
  colony: ColonyType,
|};

const ColonyGridItem = ({ colony }: Props) => (
  <div className={styles.main}>
    <Link to={`/colony/${colony.ensName}`}>
      <ColonyAvatar address={colony.address} colony={colony} />
      <Heading text={colony.name} appearance={{ size: 'small' }} />
    </Link>
  </div>
);

export default ColonyGridItem;
