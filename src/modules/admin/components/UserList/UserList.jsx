/* @flow */

import type { MessageDescriptor } from 'react-intl';

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';

import type { Address } from '~types';

import { pipe, mergePayload, withKey } from '~utils/actions';
import { useAsyncFunction } from '~utils/hooks';
import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import UserListItem from './UserListItem.jsx';

import styles from './UserList.css';

type Props = {|
  /*
   * Array of user data, follows the same format as UserPicker
   */
  users: string[],
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
  /** Redux action to dispatch on submit (e.g. CREATE_XXX) */
  remove: string,
  /** Redux action listener for successful action (e.g. CREATE_XXX_SUCCESS) */
  removeSuccess: string,
  /** Redux action listener for unsuccessful action (e.g. CREATE_XXX_ERROR) */
  removeError: string,
  /* Colony address to use when removing the user */
  colonyAddress: Address,
|};

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
    (user: string) => removeFn({ user }),
    // This is unnecessary because the ref is never changing. The linter isn't smart enough to know that though
    [removeFn],
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
                // TODO: we probably want to delegate this to the userListItem somehow?
                onRemove={handleRemove}
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
