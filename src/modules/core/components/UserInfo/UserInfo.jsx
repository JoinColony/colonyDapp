/* @flow */

import React from 'react';

import { maskAddress } from '~utils/strings';

import { Tooltip } from '~core/Popover';
import UserMention from '~core/UserMention';

import styles from './UserInfo.css';

const componentDisplayName: string = 'UserInfo';

type Props = {
  /*
   * Children elemnts or components to wrap the tooltip around
   */
  children: React$Element<*>,
  /*
   * The user's name (aka Display Name)
   */
  displayName?: string,
  /*
   * Users's handle (aka Username)
   */
  username?: string,
  /*
   * User's wallet address
   */
  walletAddress?: string,
  /*
   * How the popover gets triggered
   */
  trigger?: 'always' | 'hover' | 'click' | 'disabled',
};

const UserInfo = ({
  displayName,
  username,
  walletAddress,
  trigger = 'hover',
  children,
}: Props) => (
  <Tooltip
    content={
      <div className={styles.main}>
        {displayName && <p className={styles.displayName}>{displayName}</p>}
        {username && <UserMention ensName={username} to="" />}
        {walletAddress && (
          <p className={styles.walletAddress}>{maskAddress(walletAddress)}</p>
        )}
      </div>
    }
    trigger={trigger}
  >
    {children}
  </Tooltip>
);

UserInfo.displayName = componentDisplayName;

export default UserInfo;
