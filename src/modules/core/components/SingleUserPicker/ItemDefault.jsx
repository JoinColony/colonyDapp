/* @flow */

import type { Node } from 'react';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import cx from 'classnames';

import type { UserType } from '~immutable';
import type { Address } from '~types';
import type { ItemDataType } from '~core/OmniPicker';

import MaskedAddress from '~core/MaskedAddress';
import UserMention from '~core/UserMention';

import styles from './ItemDefault.css';

const MSG = defineMessages({
  ownName: {
    id: 'SingleUserPicker.ItemWithYouText.youText',
    defaultMessage: '(you)',
  },
});

type Props = {|
  walletAddress?: Address,
  itemData: ItemDataType<UserType>,
  renderAvatar: (address: Address, user: ItemDataType<UserType>) => Node,
  selected?: boolean,
  showAddress?: boolean,
  /*
   * Same as showAddress, just display a masked (shortened) address instead
   */
  showMaskedAddress?: boolean,
|};

const ItemDefault = ({
  walletAddress,
  itemData: {
    profile: { walletAddress: userAddress, displayName, username },
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
        <span className={styles.displayName}>
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
