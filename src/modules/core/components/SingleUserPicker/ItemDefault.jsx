/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import cx from 'classnames';

import type { UserData } from './types';

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
  itemData: UserData,
  selected?: boolean,
  showAddress?: boolean,
  /*
   * Same as showAddress, just display a masked (shortened) address instead
   */
  showMaskedAddress?: boolean,
};

const ItemDefault = ({
  currentUserId,
  itemData: { id, fullName, username },
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
      userId={id}
      username={username || id}
      walletAddress={id}
    />
    <span className={styles.dataContainer}>
      {fullName && (
        <span className={styles.fullName}>
          {fullName}
          {currentUserId === id && (
            <span className={styles.thatsYou}>
              <FormattedMessage {...MSG.ownName} />
            </span>
          )}
        </span>
      )}
      {username && <UserMention username={username} />}
      {showAddress && <span className={styles.address}>{id}</span>}
      {!showAddress &&
        showMaskedAddress && (
          <span className={styles.address}>
            <MaskedAddress address={id} />
          </span>
        )}
    </span>
  </span>
);

ItemDefault.displayName = 'SingleUserPicker.ItemDefault';

export default ItemDefault;
