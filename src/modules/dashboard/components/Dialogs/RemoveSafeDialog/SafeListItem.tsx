import React from 'react';
import { defineMessages } from 'react-intl';

import { GNOSIS_SAFE_NETWORKS } from '~constants';
import Avatar from '~core/Avatar';
import { Checkbox } from '~core/Fields';
import MaskedAddress from '~core/MaskedAddress';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import { ColonySafe } from '~data/index';

import styles from './SafeListItem.css';

const MSG = defineMessages({
  copyMessage: {
    id: 'dashboard.Dialogs.RemoveSafeDialog.SafeListItem.copyMessage',
    defaultMessage: 'Click to copy Gnosis Safe address',
  },
});

interface Props {
  safe: ColonySafe;
  isChecked: boolean;
}

const SafeListItem = ({ safe, isChecked }: Props) => {
  const safeNetwork = GNOSIS_SAFE_NETWORKS.find(
    (network) => network.chainId === Number(safe.chainId),
  );
  return (
    <div
      className={`${styles.main} ${isChecked && styles.checked}`}
      data-test="safeListItem"
    >
      <Checkbox
        name="safeList"
        appearance={{ theme: 'pink' }}
        value={safe.contractAddress}
        className={styles.checkbox}
      />
      <Avatar
        placeholderIcon="circle-close"
        seed={safe.contractAddress}
        title={safe.safeName || safe.contractAddress}
        size="xs"
        className={styles.avatar}
      />

      <span className={`${isChecked ? styles.selectedLabel : styles.label}`}>
        {`${safe.safeName} (${safeNetwork?.name || 'Unknown'})`}
      </span>

      <InvisibleCopyableAddress
        address={safe.contractAddress}
        copyMessage={MSG.copyMessage}
      >
        <div className={styles.address}>
          <MaskedAddress address={safe.contractAddress} />
        </div>
      </InvisibleCopyableAddress>
    </div>
  );
};

SafeListItem.displayName = 'dashboard.RemoveSafeDialog.SafeListItem';

export default SafeListItem;
