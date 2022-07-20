import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import MaskedAddress from '~core/MaskedAddress';
import Avatar from '~core/Avatar';
import { AnyUser } from '~data/index';

import styles from './AddressDetailsView.css';

const MSG = defineMessages({
  contract: {
    id: 'dashboard.GnosisControlSafeDialog.AddressDetailsView.contract',
    defaultMessage: 'Contract',
  },
});

interface Props {
  item: AnyUser;
  isSafeItem: boolean;
}

const AddressDetailsView = ({ item, isSafeItem }: Props) => {
  const userDisplayName = item?.profile?.displayName;
  const username = item?.profile?.username;

  return (
    <div className={styles.main}>
      <Avatar
        seed={item.id.toLowerCase()}
        size="xs"
        avatarURL={item?.profile?.avatarHash || ''}
        title="avatar"
        placeholderIcon={isSafeItem ? 'gnosis-logo' : 'circle-person'}
      />
      <span className={styles.name}>
        {isSafeItem ? (
          <FormattedMessage {...MSG.contract} />
        ) : (
          userDisplayName || `@${username}`
        )}
      </span>
      <MaskedAddress address={item.id} />
    </div>
  );
};

export default AddressDetailsView;
