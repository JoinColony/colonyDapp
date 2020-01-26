import React, { KeyboardEvent, ReactNode, useCallback } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import MaskedAddress from '~core/MaskedAddress';
import { TableRow, TableCell } from '~core/Table';
import UserMention from '~core/UserMention';
import { Address, ENTER } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { getMainClasses } from '~utils/css';
import { useUser } from '~data/index';

import styles from './UserListItem.css';

const MSG = defineMessages({
  buttonRemove: {
    id: 'admin.UserListItem.buttonRemove',
    defaultMessage: 'Remove',
  },
  pending: {
    id: 'admin.UserListItem.pending',
    defaultMessage: 'Transaction pending',
  },
});

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const componentDisplayName = 'admin.UserListItem';

interface Props {
  /*
   * User address
   */
  address: Address;

  /*
   * Children
   */
  children?: ReactNode;

  /*
   * Whether to show the fullname
   */
  showDisplayName?: boolean;

  /*
   * Whether to show the username
   */
  showUsername?: boolean;

  /*
   * The user's address will always be shown, this just controlls if it's
   * shown in full, or masked.
   */
  showMaskedAddress?: boolean;

  /*
   * Whether to show the remove button
   */
  viewOnly?: boolean;

  /*
   * Method to call when the table row is clicked
   */
  onClick?: (address: Address) => any;

  /*
   * Method to call when clicking the remove button
   */
  onRemove?: (evt: MouseEvent) => void;
}

const UserListItem = ({
  address,
  children,
  showDisplayName = false,
  showUsername = false,
  showMaskedAddress = false,
  viewOnly = true,
  onClick: callbackFn,
  onRemove,
}: Props) => {
  // @TODO pass down user to UserListItem
  // @body once the roles come through apollo, this can be sync and passed down from the parent as we can get the whole list of users easily
  const user = useUser(address);

  const {
    profile: { username, displayName },
  } = user;

  const handleClick = useCallback(() => {
    if (typeof callbackFn === 'function') {
      callbackFn(address);
    }
  }, [address, callbackFn]);

  const handleKeyPress = useCallback(
    (evt: KeyboardEvent<HTMLElement>) => {
      if (evt.key === ENTER) {
        if (callbackFn) callbackFn(address);
      }
    },
    [address, callbackFn],
  );

  const rowProps = callbackFn
    ? {
        onClick: handleClick,
        onKeyPress: handleKeyPress,
        tabIndex: 0,
      }
    : {};

  return (
    <TableRow
      className={getMainClasses({}, styles, { hasCallbackFn: !!callbackFn })}
      {...rowProps}
    >
      <TableCell className={styles.userAvatar}>
        <UserAvatar size="xs" address={address} user={user} />
      </TableCell>
      <TableCell className={styles.userDetails}>
        {showDisplayName && displayName && (
          <span className={styles.displayName} title={displayName}>
            {displayName}
          </span>
        )}
        {showUsername && username && (
          <span className={styles.username}>
            <UserMention hasLink={false} username={username} />
          </span>
        )}
        <span className={styles.address}>
          {showMaskedAddress ? (
            <MaskedAddress address={address} />
          ) : (
            <span>{address}</span>
          )}
        </span>
      </TableCell>
      {children}
      {!viewOnly && onRemove && (
        <TableCell className={styles.userRemove}>
          <Button
            className={styles.customRemoveButton}
            appearance={{ theme: 'primary' }}
            text={MSG.buttonRemove}
            onClick={onRemove}
          />
        </TableCell>
      )}
    </TableRow>
  );
};

UserListItem.displayName = componentDisplayName;

export default UserListItem;
