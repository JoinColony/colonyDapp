/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import type { UserData } from './types';
import UserAvatar from '~core/UserAvatar';
import styles from './ItemDefault.css';

const MSG = defineMessages({
  ownName: {
    id: 'Assignment.ItemWithYouText.youText',
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
}: Props) => (
  <span className={styles.main}>
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
    </span>
  </span>
);
ItemDefault.displayName = 'Assignment.ItemDefault';
export default ItemDefault;
