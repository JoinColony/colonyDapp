/* @flow */

import React from 'react';

import type { UserType } from '~immutable';

import { Tooltip } from '~core/Popover';
import UserMention from '~core/UserMention';
import CopyableAddress from '~core/CopyableAddress';

import styles from './InfoPopover.css';

const componentDisplayName: string = 'InfoPopover';

type Props = {|
  /** Children elemnts or components to wrap the tooltip around */
  children: React$Element<*>,
  /** The user object */
  user?: UserType,
  /** How the popover gets triggered */
  trigger?: 'hover' | 'click' | 'disabled',
|};

const renderTooltipContent = (user?: UserType) => {
  if (!user) return null;
  const {
    profile: { displayName, username, walletAddress },
  } = user;
  return (
    <div className={styles.main}>
      {displayName && (
        <p title={displayName} className={styles.displayName}>
          {displayName}
        </p>
      )}
      {username && (
        <span title={username} className={styles.userName}>
          <UserMention username={username} hasLink />
        </span>
      )}
      {walletAddress && <CopyableAddress full>{walletAddress}</CopyableAddress>}
    </div>
  );
};

const InfoPopover = ({ user, children, trigger = 'click' }: Props) => (
  <Tooltip
    content={renderTooltipContent(user)}
    trigger={user ? trigger : 'disabled'}
    darkTheme={false}
  >
    {/*
     * This wrapper is needed because, if the child in an in-line element, the
     * tooltip component won't trigger
     */}
    <div className={styles.content}>{children}</div>
  </Tooltip>
);

InfoPopover.displayName = componentDisplayName;

export default InfoPopover;
