import React from 'react';

import Heading from '~core/Heading';
import Link from '~core/Link';
import { SpinnerLoader } from '~core/Preloaders';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import { useColonyProfileQuery } from '~data/index';

import styles from './ColonyGridItem.css';

interface Props {
  colonyAddress: string;
}

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

const ColonyGridItem = ({ colonyAddress }: Props) => {
  const { data, loading } = useColonyProfileQuery({
    variables: { address: colonyAddress },
  });

  if (loading || !data) {
    return (
      <div className={styles.loader}>
        <SpinnerLoader appearance={{ size: 'medium' }} />
      </div>
    );
  }

  const {
    processedColony: { colonyName, displayName },
    processedColony: colony,
  } = data;

  return (
    <div className={styles.main}>
      <Link to={`/colony/${colonyName}`}>
        <ColonyAvatar colonyAddress={colonyAddress} colony={colony} />
        <Heading appearance={{ size: 'small' }}>
          <span
            title={displayName || colonyName}
            className={styles.displayName}
          >
            {displayName || colonyName}
          </span>
        </Heading>
      </Link>
    </div>
  );
};

export default ColonyGridItem;
