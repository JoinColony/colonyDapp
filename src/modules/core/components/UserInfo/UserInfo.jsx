/* @flow */

import React from 'react';

import { maskAddress } from '~utils/strings';

import { Tooltip } from '~core/Popover';
import UserMention from '~core/UserMention';

import styles from './UserInfo.css';

const componentDisplayName: string = 'core.UserInfo';

type Props = {
  /*
   * Children elemnts or components to wrap the tooltip around
   */
  children: React$Element<*>,
  /*
   * The user's name (aka Display Name)
   */
  name: string,
  /*
   * Users's handle (aka Username)
   */
  handle: string,
  /*
   * User's wallet address
   */
  walletAddress: string,
};

const UserInfo = ({ name, handle, walletAddress, children }: Props) => (
  <Tooltip
    content={
      <div className={styles.main}>
        {name && <p className={styles.name}>{name}</p>}
        {handle && <UserMention ensName={handle} to="" />}
        {walletAddress && (
          <p className={styles.address}>{maskAddress(walletAddress)}</p>
        )}
      </div>
    }
  >
    {children}
  </Tooltip>
);

UserInfo.displayName = componentDisplayName;

export default UserInfo;
