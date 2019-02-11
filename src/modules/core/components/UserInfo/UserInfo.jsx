/* @flow */

import React from 'react';

import { Tooltip } from '~core/Popover';
import UserMention from '~core/UserMention';
import MaskedAddress from '~core/MaskedAddress';

import styles from './UserInfo.css';

const componentDisplayName: string = 'UserInfo';

type Props = {|
  /** Children elemnts or components to wrap the tooltip around */
  children: React$Element<*>,
  /** The user's name (aka Display Name) */
  displayName?: string,
  /** Users's handle (aka Username) */
  username?: string,
  /** User's wallet address */
  walletAddress?: string,
  /** How the popover gets triggered */
  trigger?: 'hover' | 'click' | 'disabled',
|};

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
        {username && <UserMention username={username} to="" />}
        {walletAddress && (
          <p className={styles.walletAddress}>
            <MaskedAddress address={walletAddress} />
          </p>
        )}
      </div>
    }
    trigger={trigger}
  >
    {/*
     * This wrapper is needed because, if the child in an in-line element, the
     * tooltip component won't trigger
     */}
    <div className={styles.content}>{children}</div>
  </Tooltip>
);

UserInfo.displayName = componentDisplayName;

export default UserInfo;
