import React from 'react';
import { isAddress } from 'web3-utils';

import MaskedAddress from '~core/MaskedAddress';
import Avatar from '~core/Avatar';
import { AnyUser } from '~data/index';
import { InvisibleCopyableMaskedAddress } from '~dashboard/ActionsPage/DetailsWidget/DetailsWidgetSafeTransaction/components';

import styles from './AddressDetailsView.css';

interface Props {
  item: AnyUser;
  isSafeItem: boolean;
  isCopyable?: boolean;
}

const AddressDetailsView = ({ item, isSafeItem, isCopyable }: Props) => {
  const userDisplayName = isAddress(item.profile.displayName || '')
    ? /*
       * If address entered manually, e.g. in raw transaction
       * or if you wish to transfer funds to someone outside the colony
       */
      'Address'
    : item.profile.displayName;
  const { username } = item.profile;

  const Address = isCopyable ? InvisibleCopyableMaskedAddress : MaskedAddress;
  return (
    <div className={styles.main}>
      <Avatar
        seed={item.profile.walletAddress.toLowerCase()}
        size="xs"
        avatarURL={item.profile?.avatarHash || ''}
        title="avatar"
        placeholderIcon={isSafeItem ? 'safe-logo' : 'circle-person'}
        className={styles.avatar}
      />
      <span className={styles.name}>{userDisplayName || `@${username}`}</span>
      <Address address={item.profile.walletAddress} />
    </div>
  );
};

export default AddressDetailsView;
