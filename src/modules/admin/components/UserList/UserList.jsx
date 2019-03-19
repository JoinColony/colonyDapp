/* @flow */

import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';

import type { ColonyAdminType } from '~immutable';

import { withKeyPath } from '~utils/actions';
import { ACTIONS } from '~redux';

import type { AsyncFunction } from '../../../../createPromiseListener';

import promiseListener from '../../../../createPromiseListener';
import UserListItem from './UserListItem.jsx';

import styles from './UserList.css';

type Props = {|
  /*
   * Array of user data, follows the same format as UserPicker
   */
  users: Array<ColonyAdminType>,
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
  /* Colony ENS Name to use when removing the user */
  ensName: string,
|};

const displayName: string = 'admin.UserList';

class UserList extends Component<Props> {
  remove: AsyncFunction<Object, empty>;

  static displayName = 'admin.UserList';

  static defaultProps = {
    remove: ACTIONS.COLONY_ADMIN_REMOVE,
    removeSuccess: ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS,
    removeError: ACTIONS.COLONY_ADMIN_REMOVE_ERROR,
  };

  constructor(props: Props) {
    super(props);
    const { remove, removeSuccess, removeError, ensName } = this.props;

    const setPayload = (originalAction: *, payload: Object) =>
      withKeyPath(ensName)()({ ...originalAction, payload });

    this.remove = promiseListener.createAsyncFunction({
      start: remove,
      resolve: removeSuccess,
      reject: removeError,
      setPayload,
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
                  key={`${user.address}${currentIndex + 1}`}
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
