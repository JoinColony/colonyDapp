/* @flow */

import React from 'react';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import UserListItem from './UserListItem.jsx';

import styles from './UserList.css';

import type { MessageDescriptor } from 'react-intl';
import type { UserData } from '~core/SingleUserPicker';

type Props = {
  /*
   * Array of user data, follows the same format as UserPicker
   */
  users: Array<UserData>,
  /*
   * Whether to show the fullname
   * Gets passed down to `UserListItem`
   */
  showDisplayName?: boolean,
  /*
   * Whether to show the username
   * Gets passed down to `UserListItem`
   */
  showUsername?: boolean,
  /*
   * The user's address will always be shown, this just controlls if it's
   * shown in full, or masked.
   * Gets passed down to `UserListItem`
   */
  showMaskedAddress?: boolean,
  /*
   * Whether to show the remove button
   * Gets passed down to `UserListItem`
   */
  viewOnly?: boolean,
  /*
   * Title to show before the list
   */
  label?: string | MessageDescriptor,
  /*
   * Method to call when removing the user
   * Gets passed down to `UserListItem`
   */
  onRemove: UserData => any,
};

const displayName: string = 'admin.UserList';

const UserList = ({
  users,
  showDisplayName,
  showUsername,
  showMaskedAddress,
  viewOnly = true,
  label,
  onRemove,
}: Props) => (
  <div className={styles.main}>
    {label && (
      <Heading
        appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
        text={label}
      />
    )}
    <Table scrollable>
      <TableBody>
        {users.map(user => (
          <UserListItem
            key={user.id}
            user={user}
            showDisplayName={showDisplayName}
            showUsername={showUsername}
            showMaskedAddress={showMaskedAddress}
            viewOnly={viewOnly}
            onRemove={() => onRemove(user)}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);

UserList.displayName = displayName;

export default UserList;
