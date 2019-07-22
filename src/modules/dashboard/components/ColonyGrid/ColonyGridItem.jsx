/* @flow */

import React from 'react';

import { useDataFetcher } from '~utils/hooks';
import Heading from '~core/Heading';
import Link from '~core/Link';
import { SpinnerLoader } from '~core/Preloaders';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';

import { useColonyWithAddress } from '../../hooks/useColony';
import { colonyNameFetcher } from '../../fetchers';

import styles from './ColonyGridItem.css';

import type { ENSName } from '~types';
import type { ColonyProps } from '~immutable';

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

type Props = ColonyProps<{ colonyAddress: * }>;

const ColonyGridItem = ({ colonyAddress }: Props) => {
  const { isFetching, data: colony } = useColonyWithAddress(colonyAddress);
  const {
    data: colonyName,
    isFetching: isFetchingColonyName,
  } = useDataFetcher<ENSName>(
    colonyNameFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  /**
   * @TODO ColonyGridItem: error handling for colony not found
   * @BODY If the colonyName is not found, we should throw an error or render an error message
   */
  if (!colony || !colonyName || isFetching || isFetchingColonyName)
    return (
      <div className={styles.loader}>
        <SpinnerLoader appearance={{ size: 'medium' }} />
      </div>
    );

  return (
    <div className={styles.main}>
      <Link to={`/colony/${colonyName}`}>
        <ColonyAvatar colonyAddress={colonyAddress} colony={colony} />
        <Heading appearance={{ size: 'small' }}>
          <span title={colony.displayName} className={styles.displayName}>
            {colony.displayName}
          </span>
        </Heading>
      </Link>
    </div>
  );
};

export default ColonyGridItem;
