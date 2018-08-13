/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import cx from 'classnames';

import type { UserData } from './types';

import UserAvatar from '../UserAvatar';

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
};

const ItemDefault = ({
  currentUserId,
  itemData: { id, fullName, username },
  showAddress,
}: Props) => (
  <span className={cx(styles.main, { [styles.showAddress]: showAddress })}>
    <UserAvatar size="s" userId={id} username={username || id} />
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
      {username && <span className={styles.username}>{`@${username}`}</span>}
      {showAddress && <span className={styles.address}>{id}</span>}
    </span>
  </span>
);

ItemDefault.displayName = 'SingleUserPicker.ItemDefault';

export default ItemDefault;
