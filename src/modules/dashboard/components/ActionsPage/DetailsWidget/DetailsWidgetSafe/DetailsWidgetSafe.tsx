import React from 'react';

import Avatar from '~core/Avatar';
import MaskedAddress from '~core/MaskedAddress';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import { ColonySafe } from '~data/index';

import styles from './DetailsWidgetSafe.css';

const displayName = 'DetailsWidget.DetailsWidgetSafe';

interface Props {
  safe: ColonySafe;
}

const DetailsWidgetSafe = ({
  safe: { chainId, contractAddress, safeName },
}: Props) => {
  const userDisplayName = chainId;
  const username = safeName;
  return (
    <div className={styles.main}>
      <Avatar
        seed={contractAddress.toLowerCase()}
        size="xs"
        title="avatar"
        placeholderIcon="gnosis-logo"
      />
      <div className={styles.textContainer}>
        {(userDisplayName || username) && (
          <div className={styles.displayName}>
            {userDisplayName || `@${username}`}
          </div>
        )}
        <InvisibleCopyableAddress address={contractAddress}>
          <div className={styles.address}>
            <MaskedAddress address={contractAddress} />
          </div>
        </InvisibleCopyableAddress>
      </div>
    </div>
  );
};

DetailsWidgetSafe.displayName = displayName;

export default DetailsWidgetSafe;
