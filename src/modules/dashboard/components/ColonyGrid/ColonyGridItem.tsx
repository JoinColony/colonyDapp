import React from 'react';

import { useDataFetcher } from '~utils/hooks';
import Heading from '~core/Heading';
import Link from '~core/Link';
import { SpinnerLoader } from '~core/Preloaders';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import { log } from '~utils/debug';

import { useColonyWithAddress } from '../../hooks/useColony';
import { colonyNameFetcher } from '../../fetchers';
import { ENSName } from '~types/index';
import { ColonyProps } from '~immutable/index';
import styles from './ColonyGridItem.css';

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });
type Props = ColonyProps<'colonyAddress'>;

const ColonyGridItem = ({ colonyAddress }: Props) => {
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
      <div className={styles.loader}>
        <SpinnerLoader appearance={{ size: 'medium' }} />
      </div>
    );
  }

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
