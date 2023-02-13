import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { SAFE_NETWORKS } from '~constants';
import Avatar from '~core/Avatar';
import { Checkbox } from '~core/Fields';
import MaskedAddress from '~core/MaskedAddress';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import { ColonySafe } from '~data/index';

import styles from './SafeListItem.css';

const MSG = defineMessages({
  copyMessage: {
    id: 'dashboard.Dialogs.RemoveSafeDialog.SafeListItem.copyMessage',
    defaultMessage: 'Click to copy Safe address',
  },
  safeNamePlaceholder: {
    id: 'dashboard.Dialogs.RemoveSafeDialog.SafeListItem.safeNamePlaceholder',
    defaultMessage: 'Unknown',
  },
});

interface Props {
  safe: ColonySafe;
  isChecked: boolean;
}

const SafeListItem = ({ safe, isChecked }: Props) => {
  const { formatMessage } = useIntl();
  const safeNetwork = SAFE_NETWORKS.find(
    (network) => network.chainId === Number(safe.chainId),
  );
  return (
    <div
      className={`${styles.main} ${isChecked && styles.checked}`}
      data-test="safeListItem"
    >
      <Checkbox
        name="safeList"
        appearance={{ theme: 'pink', direction: 'vertical' }}
        value={safe}
        className={styles.checkbox}
      />
      <Avatar
        placeholderIcon="circle-close"
        seed={safe.contractAddress.toLowerCase()}
        title={safe.safeName || safe.contractAddress}
        size="xs"
        className={styles.avatar}
      />

      <span className={`${isChecked ? styles.selectedLabel : styles.label}`}>
        {`${safe.safeName} (${
          safeNetwork?.name || formatMessage(MSG.safeNamePlaceholder)
        })`}
      </span>

      <InvisibleCopyableAddress
        address={safe.contractAddress}
        copyMessage={MSG.copyMessage}
        tooltipPlacement="top"
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
