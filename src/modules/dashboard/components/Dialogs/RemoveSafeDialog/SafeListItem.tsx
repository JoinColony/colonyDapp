import React from 'react';
import { defineMessages } from 'react-intl';

import Avatar from '~core/Avatar';
import { Checkbox } from '~core/Fields';
import MaskedAddress from '~core/MaskedAddress';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import { Safe } from './types';

import styles from './SafeListItem.css';

const MSG = defineMessages({
  copyMessage: {
    id: 'dashboard.Dialogs.RemoveSafeDialog.SafeListItem.copyMessage',
    defaultMessage: 'Click to copy Gnosis Safe address',
  },
});

interface Props {
  safe: Safe;
  isChecked: boolean;
}

const SafeListItem = ({ safe, isChecked }: Props) => {
  return (
    <div
      className={`${styles.main} ${isChecked && styles.checked}`}
      data-test="safeListItem"
    >
      <Checkbox
        name="safeList"
        appearance={{ theme: 'pink' }}
        value={safe.address}
        className={styles.checkbox}
      />
      <Avatar
        avatarURL={undefined}
        placeholderIcon="circle-close"
        seed={safe.address}
        title={safe.name || safe.address}
        size="xs"
        className={styles.avatar}
      />

      <span className={`${isChecked ? styles.selectedLabel : styles.label}`}>
        {safe.name}
      </span>

      <InvisibleCopyableAddress
        address={safe.address}
        copyMessage={MSG.copyMessage}
      >
        <div className={styles.address}>
          <MaskedAddress address={safe.address} />
        </div>
      </InvisibleCopyableAddress>
    </div>
  );
};

SafeListItem.displayName = 'dashboard.RemoveSafeDialog.SafeListItem';

export default SafeListItem;
