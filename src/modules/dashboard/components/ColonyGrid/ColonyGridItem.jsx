/* @flow */

import React from 'react';

import Heading from '~core/Heading';
import Link from '~core/Link';
import { SpinnerLoader } from '~core/Preloaders';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';

import { useColonyWithAddress } from '../../hooks';

import styles from './ColonyGridItem.css';

import type { ColonyProps } from '~immutable';

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

type Props = ColonyProps<{ colonyAddress: * }>;

const ColonyGridItem = ({ colonyAddress }: Props) => {
  const { isFetching, data: colony } = useColonyWithAddress(colonyAddress);

  if (!colony || isFetching) return <SpinnerLoader />;

  return (
    <div className={styles.main}>
      <Link to={`/colony/${colony.colonyName}`}>
        <ColonyAvatar colonyAddress={colonyAddress} colony={colony} />
        <Heading text={colony.displayName} appearance={{ size: 'small' }} />
      </Link>
    </div>
  );
};

export default ColonyGridItem;
