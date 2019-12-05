import React, { ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import cx from 'classnames';

import { User } from '~data/index';
import { Address } from '~types/index';
import { ItemDataType } from '~core/OmniPicker';
import MaskedAddress from '~core/MaskedAddress';
import UserMention from '~core/UserMention';
import styles from './ItemDefault.css';

const MSG = defineMessages({
  ownName: {
    id: 'SingleUserPicker.ItemWithYouText.youText',
    defaultMessage: '(you)',
  },
});

interface Props {
  walletAddress?: Address;
  itemData: ItemDataType<User>;
  renderAvatar: (address: Address, user: ItemDataType<User>) => ReactNode;
  selected?: boolean;
  showAddress?: boolean;

  /*
   * Same as showAddress, just display a masked (shortened) address instead
   */
  showMaskedAddress?: boolean;
}
const ItemDefault = ({
  walletAddress,
  itemData: {
    profile: { walletAddress: userAddress, displayName, username } = {
      /*
       * @NOTE This is a last resort default!
       *
       * If the app ever gets to use this value, the SingleUserPickerItem
       * compontn will display: _Address format is wrong!_
       */
      walletAddress: '',
    },
  },
  itemData,
  renderAvatar,
  showAddress,
  showMaskedAddress,
}: Props) => (
  <span
    className={cx(styles.main, {
      [styles.showAddress]: showAddress || showMaskedAddress,
    })}
  >
    {renderAvatar(userAddress, itemData)}
    <span className={styles.dataContainer}>
      {displayName && (
        <span>
          {displayName}
          {walletAddress === userAddress && (
            <span className={styles.thatsYou}>
              &nbsp;
              <FormattedMessage {...MSG.ownName} />
            </span>
          )}
          &nbsp;
        </span>
      )}
      {username && <UserMention username={username} hasLink={false} />}
      {showAddress && <span className={styles.address}>{userAddress}</span>}
      {!showAddress && showMaskedAddress && (
        <span className={styles.address}>
          <MaskedAddress address={userAddress} />
        </span>
      )}
    </span>
  </span>
);

ItemDefault.displayName = 'SingleUserPicker.ItemDefault';

export default ItemDefault;
