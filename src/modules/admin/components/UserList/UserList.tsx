import { MessageDescriptor } from 'react-intl';
import React, { useCallback } from 'react';

import { Address } from '~types/index';
import { pipe, mergePayload, withKey } from '~utils/actions';
import { useAsyncFunction } from '~utils/hooks';
import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';
import UserListItem from '../UserListItem/UserListItem';
import styles from './UserList.css';

interface Props {
  /*
   * Array of user data, follows the same format as UserPicker
   */
  users: Address[];

  /*
   * Whether to show the fullname
   * Gets passed down to `UserListItem`
   */
  showDisplayName?: boolean;

  /*
   * Whether to show the username
   * Gets passed down to `UserListItem`
   */
  showUsername?: boolean;

  /*
   * The user's address will always be shown, this just controlls if it's
   * shown in full, or masked.
   * Gets passed down to `UserListItem`
   */
  showMaskedAddress?: boolean;

  /*
   * Whether to show the remove button
   * Gets passed down to `UserListItem`
   */
  viewOnly?: boolean;

  /*
   * Title to show before the list
   */
  label?: string | MessageDescriptor;

  /** Redux action to dispatch on submit (e.g. CREATE_XXX) */
  remove: string;

  /** Redux action listener for successful action (e.g. CREATE_XXX_SUCCESS) */
  removeSuccess: string;

  /** Redux action listener for unsuccessful action (e.g. CREATE_XXX_ERROR) */
  removeError: string;

  /* Colony address to use when removing the user */
  colonyAddress: Address;
}

const displayName = 'admin.UserList';

const UserList = ({
  colonyAddress,
  label,
  remove,
  removeSuccess,
  removeError,
  users,
  showDisplayName,
  showUsername,
  showMaskedAddress,
  viewOnly = true,
}: Props) => {
  const transform = pipe(
    withKey(colonyAddress),
    mergePayload({ colonyAddress }),
  );

  const removeFn = useAsyncFunction({
    submit: remove,
    success: removeSuccess,
    error: removeError,
    transform,
  });

  const handleRemove = useCallback(
    (user: string) =>
      remove && removeSuccess && removeError ? removeFn({ user }) : () => {},
    [remove, removeSuccess, removeError, removeFn],
  );

  return (
    <div className={styles.main}>
      {label && (
        <Heading
          appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
          text={label}
        />
      )}
      <div className={styles.listWrapper}>
        <Table scrollable>
          <TableBody>
            {users.map(user => (
              <UserListItem
                key={user}
                address={user}
                showDisplayName={showDisplayName}
                showUsername={showUsername}
                showMaskedAddress={showMaskedAddress}
                viewOnly={viewOnly}
                onRemove={() => handleRemove(user)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

UserList.displayName = displayName;

export default UserList;
