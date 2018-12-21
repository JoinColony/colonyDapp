/* @flow */

import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import type { AsyncFunction } from '../../../../createPromiseListener';
import type { ColonyAdminRecord } from '~immutable';

import promiseListener from '../../../../createPromiseListener';
import UserListItem from './UserListItem.jsx';

import {
  COLONY_ADMIN_REMOVE,
  COLONY_ADMIN_REMOVE_SUCCESS,
  COLONY_ADMIN_REMOVE_ERROR,
} from '../../../dashboard/actionTypes';

import styles from './UserList.css';

type Props = {
  /*
   * Array of user data, follows the same format as UserPicker
   */
  users: Array<ColonyAdminRecord>,
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
};

const displayName: string = 'admin.UserList';

class UserList extends Component<Props> {
  remove: AsyncFunction<Object, empty>;

  static displayName = 'admin.UserList';

  static defaultProps = {
    remove: COLONY_ADMIN_REMOVE,
    removeSuccess: COLONY_ADMIN_REMOVE_SUCCESS,
    removeError: COLONY_ADMIN_REMOVE_ERROR,
  };

  constructor(props: Props) {
    super(props);
    const { remove, removeSuccess, removeError } = this.props;
    this.remove = promiseListener.createAsyncFunction({
      start: remove,
      resolve: removeSuccess,
      reject: removeError,
    });
  }

  componentWillUnmount() {
    this.remove.unsubscribe();
  }

  render() {
    const {
      users,
      showDisplayName,
      showUsername,
      showMaskedAddress,
      viewOnly = true,
      label,
    } = this.props;
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
              {users.map((user, currentIndex) => (
                <UserListItem
                  /*
                   * This is just so we can have duplicate data inside datamocks
                   * Might as well remove it when the *real* data comes in
                   */
                  key={`${user.walletAddress}${currentIndex + 1}`}
                  user={user}
                  showDisplayName={showDisplayName}
                  showUsername={showUsername}
                  showMaskedAddress={showMaskedAddress}
                  viewOnly={viewOnly}
                  onRemove={() => this.remove.asyncFunction({ admin: user })}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

UserList.displayName = displayName;

export default UserList;
