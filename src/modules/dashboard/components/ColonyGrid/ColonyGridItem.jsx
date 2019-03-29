/* @flow */

import React from 'react';

import { useDataFetcher } from '~utils/hooks';

import ColonyAvatar from '~core/ColonyAvatar';
import Heading from '~core/Heading';
import Link from '~core/Link';
import { SpinnerLoader } from '~core/Preloaders';

import { colonyFetcher } from '../../fetchers';
import useColonyENSName from './useColonyENSName';

import styles from './ColonyGridItem.css';

import type { ColonyType } from '~immutable';

type Props = {|
  address: $PropertyType<ColonyType, 'address'>,
|};

const ColonyGridItem = ({ address }: Props) => {
  // TODO: in the future we should just be able to lookup by address
  const ensName = useColonyENSName(address);

  // fetch colony with ensName we just got
  const {
    isFetching: isFetchingColony,
    data: colony,
  } = useDataFetcher<ColonyType>(colonyFetcher, [ensName], [ensName]);
  const { name } = colony || {};

  if (!ensName || isFetchingColony) return <SpinnerLoader />;

  return (
    !!ensName &&
    !!colony && (
      <div className={styles.main}>
        <Link to={`/colony/${ensName}`}>
          <ColonyAvatar address={address} colony={colony} />
          <Heading text={name} appearance={{ size: 'small' }} />
        </Link>
      </div>
    )
  );
};

export default ColonyGridItem;
