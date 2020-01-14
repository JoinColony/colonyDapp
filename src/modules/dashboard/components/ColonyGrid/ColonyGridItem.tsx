import React from 'react';

import Heading from '~core/Heading';
import Link from '~core/Link';
import { SpinnerLoader } from '~core/Preloaders';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import { useColonyQuery } from '~data/index';

import styles from './ColonyGridItem.css';

interface Props {
  colonyAddress: string;
}

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

const ColonyGridItem = ({ colonyAddress }: Props) => {
  const { data, loading } = useColonyQuery({
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
    colony: { colonyName, displayName },
    colony,
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
            {displayName}
          </span>
        </Heading>
      </Link>
    </div>
  );
};

export default ColonyGridItem;
