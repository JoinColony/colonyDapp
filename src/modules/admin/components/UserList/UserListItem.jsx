/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import UserAvatar from '~core/UserAvatar';
import MaskedAddress from '~core/MaskedAddress';
import Button from '~core/Button';

import styles from './UserListItem.css';

import type { UserData } from '~core/SingleUserPicker';

const MSG = defineMessages({
  buttonRemove: {
    id: 'admin.UserList.UserListItem.buttonRemove',
    defaultMessage: 'Remove',
  },
});

const displayName = 'admin.UserList.UserListItem';

type Props = {
  /*
   * User data Object, follows the same format as UserPicker
   */
  user: UserData,
  /*
   * Whether to show the fullname
   */
  showDisplayName?: boolean,
  /*
   * Whether to show the username
   */
  showUsername?: boolean,
  /*
   * The user's address will always be shown, this just controlls if it's
   * shown in full, or masked.
   */
  showMaskedAddress?: boolean,
  /*
   * Whether to show the remove button
   */
  viewOnly: boolean,
  /*
   * Method to call when clicking the remove button
   * Gets passed down to `UserListItem`
   */
  onRemove: UserData => any,
};

const UserListItem = ({
  user: { id, username = '', fullName = '' },
  showDisplayName = false,
  showUsername = false,
  showMaskedAddress = false,
  viewOnly = true,
  onRemove,
}: Props) => (
  <TableRow className={styles.main}>
    <TableCell className={styles.userAvatar}>
      <UserAvatar size="xs" walletAddress={id} username={username} />
    </TableCell>
    <TableCell className={styles.userDetails}>
      {showDisplayName &&
        fullName && (
          <span className={styles.fullName} title={fullName}>
            {fullName}
          </span>
        )}
      {showUsername &&
        username && (
          <span
            className={styles.username}
            title={`@${username.toLowerCase()}`}
          >
            {`@${username.toLowerCase()}`}
          </span>
        )}
      <span className={styles.address}>
        {showMaskedAddress ? <MaskedAddress address={id} /> : <span>{id}</span>}
      </span>
    </TableCell>
    <TableCell className={styles.userRemove}>
      {!viewOnly && (
        <Button
          className={styles.customRemoveButton}
          appearance={{ theme: 'primary' }}
          text={MSG.buttonRemove}
          onClick={onRemove}
        />
      )}
    </TableCell>
  </TableRow>
);

UserListItem.displayName = displayName;

export default UserListItem;
