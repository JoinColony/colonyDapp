/* @flow */

import React from 'react';

import { useDataFetcher } from '~utils/hooks';

import Heading from '~core/Heading';
import Link from '~core/Link';
import { SpinnerLoader } from '~core/Preloaders';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';

import { colonyFetcher } from '../../fetchers';
import useColonyName from './useColonyName';

import styles from './ColonyGridItem.css';

import type { ColonyProps, ColonyType } from '~immutable';

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

type Props = ColonyProps<{ colonyAddress: * }>;

const ColonyGridItem = ({ colonyAddress }: Props) => {
  // TODO: as of #1032 we can look up colony by address
  const colonyName = useColonyName(colonyAddress);

  // fetch colony with colonyName we just got
  const {
    isFetching: isFetchingColony,
    data: colony,
  } = useDataFetcher<ColonyType>(colonyFetcher, [colonyName], [colonyName]);
  const { displayName } = colony || {};

  if (!colonyName || isFetchingColony) return <SpinnerLoader />;

  return (
    !!colonyName &&
    !!colony && (
      <div className={styles.main}>
        <Link to={`/colony/${colonyName}`}>
          <ColonyAvatar address={colonyAddress} colony={colony} />
          <Heading text={displayName} appearance={{ size: 'small' }} />
        </Link>
      </div>
    )
  );
};

export default ColonyGridItem;
