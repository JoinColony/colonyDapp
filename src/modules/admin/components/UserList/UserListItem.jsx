/* @flow */

import type { IntlShape } from 'react-intl';

import React from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import MaskedAddress from '~core/MaskedAddress';
import Button from '~core/Button';
import { Tooltip } from '~core/Popover';
import { useDataFetcher } from '~utils/hooks';
import { userFetcher } from '../../../users/fetchers';

import styles from './UserListItem.css';

import type { ColonyAdminType, UserType } from '~immutable';

const MSG = defineMessages({
  buttonRemove: {
    id: 'admin.UserList.UserListItem.buttonRemove',
    defaultMessage: 'Remove',
  },
  pending: {
    id: 'admin.UserList.UserListItem.pending',
    defaultMessage: 'Transaction pending',
  },
});

const componentDisplayName = 'admin.UserList.UserListItem';

type Props = {|
  /*
   * User record
   */
  user: ColonyAdminType,
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
  onRemove: ColonyAdminType => any,
  /** @ignore Injected by `injectIntl` */
  intl: IntlShape,
|};

const UserListItem = ({
  user: { address, state = 'pending' },
  showDisplayName = false,
  showUsername = false,
  showMaskedAddress = false,
  viewOnly = true,
  onRemove,
  intl: { formatMessage },
}: Props) => {
  const { data: user } = useDataFetcher<UserType>(
    userFetcher,
    [address],
    [address],
    {
      ttl: 1000 * 60,
    },
  );
  const { profile: { username, displayName } = {} } = user || {};
  return (
    <TableRow className={styles.main}>
      <TableCell className={styles.userAvatar}>
        <UserAvatar size="xs" address={address} username={username} />
      </TableCell>
      <TableCell className={styles.userDetails}>
        {showDisplayName && displayName && (
          <span className={styles.displayName} title={displayName}>
            {displayName}
          </span>
        )}
        {showUsername && username && (
          <span className={styles.username}>
            &nbsp;
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
      <TableCell className={styles.userRemove}>
        {!viewOnly && state === 'confirmed' && (
          <Button
            className={styles.customRemoveButton}
            appearance={{ theme: 'primary' }}
            text={MSG.buttonRemove}
            onClick={onRemove}
          />
        )}
        {state === 'pending' && (
          <div className={styles.pendingDotWrapper}>
            <Tooltip
              placement="top"
              showArrow
              content={
                <span className={styles.tooltipContentReset}>
                  <FormattedMessage {...MSG.pending} />
                </span>
              }
            >
              <div className={styles.pendingDotClickArea}>
                <span
                  className={styles.pendingDot}
                  aria-label={formatMessage(MSG.pending)}
                />
              </div>
            </Tooltip>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

UserListItem.displayName = componentDisplayName;

export default injectIntl(UserListItem);
