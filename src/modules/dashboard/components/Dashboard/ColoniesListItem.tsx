import React from 'react';

import { useDataFetcher } from '~utils/hooks';
import Link from '~core/Link';
import { SpinnerLoader } from '~core/Preloaders';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import { log } from '~utils/debug';

import { useColonyWithAddress } from '../../hooks/useColony';
import { colonyNameFetcher } from '../../fetchers';
import { ENSName } from '~types/index';
import { ColonyProps } from '~immutable/index';

import styles from './ColoniesListItem.css';

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });
type Props = ColonyProps<'colonyAddress'>;

const ColoniesListItem = ({ colonyAddress }: Props) => {
  const { isFetching, data: colony } = useColonyWithAddress(colonyAddress);
  const { data: colonyName, isFetching: isFetchingColonyName } = useDataFetcher<
    ENSName
  >(colonyNameFetcher, [colonyAddress], [colonyAddress]);

  if (!isFetchingColonyName && !colonyName) {
    log.error(`Could not find colony ENS name for address ${colonyAddress}`);
    return null;
  }

  if (!colony || !colonyName || isFetching || isFetchingColonyName) {
    return (
      <div className={styles.main}>
        <SpinnerLoader appearance={{ size: 'medium' }} />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <Link to={`/colony/${colonyName}`} className={styles.linkAlignment}>
        <ColonyAvatar colonyAddress={colonyAddress} colony={colony} size="s" />
        <p title={colony.displayName} className={styles.displayName}>
          {colony.displayName}
        </p>
      </Link>
    </div>
  );
};

export default ColoniesListItem;
