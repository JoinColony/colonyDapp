/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import cx from 'classnames';

import type { UserRecord } from '~types/index';

import UserAvatar from '~core/UserAvatar';
import MaskedAddress from '~core/MaskedAddress';
import UserMention from '~core/UserMention';

import styles from './ItemDefault.css';

const MSG = defineMessages({
  ownName: {
    id: 'SingleUserPicker.ItemWithYouText.youText',
    defaultMessage: '(you)',
  },
});

type Props = {
  currentUserId?: string,
  itemData: UserRecord,
  selected?: boolean,
  showAddress?: boolean,
  /*
   * Same as showAddress, just display a masked (shortened) address instead
   */
  showMaskedAddress?: boolean,
};

const ItemDefault = ({
  currentUserId,
  itemData: { walletAddress, displayName, username },
  showAddress,
  showMaskedAddress,
}: Props) => (
  <span
    className={cx(styles.main, {
      [styles.showAddress]: showAddress || showMaskedAddress,
    })}
  >
    <UserAvatar
      size="s"
      userId={walletAddress}
      username={username || walletAddress}
      walletAddress={walletAddress}
    />
    <span className={styles.dataContainer}>
      {displayName && (
        <span className={styles.displayName}>
          {displayName}
          {currentUserId === walletAddress && (
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
