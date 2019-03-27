/* @flow */

import type { Node } from 'react';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import cx from 'classnames';

import type { UserType } from '~immutable';
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
  currentUserAddress?: string,
  itemData: ItemDataType<UserType>,
  renderAvatar: (address: string, user: ItemDataType<UserType>) => Node,
  selected?: boolean,
  showAddress?: boolean,
  /*
   * Same as showAddress, just display a masked (shortened) address instead
   */
  showMaskedAddress?: boolean,
|};

const ItemDefault = ({
  currentUserAddress,
  itemData: {
    profile: { walletAddress, displayName, username },
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
    {renderAvatar(itemData.profile.walletAddress, itemData)}
    <span className={styles.dataContainer}>
      {displayName && (
        <span className={styles.displayName}>
          {displayName}
          {currentUserAddress === walletAddress && (
            <span className={styles.thatsYou}>
              <FormattedMessage {...MSG.ownName} />
            </span>
          )}
        </span>
      )}
      {username && <UserMention username={username} hasLink={false} />}
      {showAddress && <span className={styles.address}>{walletAddress}</span>}
      {!showAddress && showMaskedAddress && (
        <span className={styles.address}>
          <MaskedAddress address={walletAddress} />
        </span>
      )}
    </span>
  </span>
);

ItemDefault.displayName = 'SingleUserPicker.ItemDefault';

export default ItemDefault;
