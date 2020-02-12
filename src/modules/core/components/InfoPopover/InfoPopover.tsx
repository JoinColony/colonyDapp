import React, { ReactNode } from 'react';

import { Address } from '~types/index';
import { AnyUser } from '~data/index';

import { Tooltip } from '~core/Popover';
import UserMention from '~core/UserMention';
import CopyableAddress from '~core/CopyableAddress';

import styles from './InfoPopover.css';

const componentDisplayName = 'InfoPopover';

interface Props {
  /** Children elemnts or components to wrap the tooltip around */
  children?: ReactNode;
  /** The address */
  user?: AnyUser;
  /** How the popover gets triggered */
  trigger?: 'hover' | 'click' | 'disabled';
}

interface TooltipProps {
  displayName?: string | null;
  username?: string | null;
  walletAddress: Address;
}

const userTooltipContent = ({
  displayName,
  username,
  walletAddress,
}: TooltipProps) => (
  <div className={styles.main}>
    {displayName && (
      <p title={displayName} className={styles.displayName}>
        {displayName}
      </p>
    )}
    {username && (
      <p title={username} className={styles.userName}>
        <UserMention username={username} hasLink />
      </p>
    )}
    <div title={walletAddress} className={styles.address}>
      <CopyableAddress full>{walletAddress}</CopyableAddress>
    </div>
  </div>
);

const conditionallyRenderContent = (user: AnyUser) => {
  if (user) {
    const { displayName, username, walletAddress } = user.profile;
    return userTooltipContent({
      displayName,
      username,
      walletAddress,
    });
  }
  return null;
};

const InfoPopover = ({ user, children, trigger = 'click' }: Props) => {
  return (
    <Tooltip
      content={conditionallyRenderContent(user)}
      trigger={user ? trigger : 'disabled'}
      darkTheme={false}
    >
      {children}
    </Tooltip>
  );
};

InfoPopover.displayName = componentDisplayName;

export default InfoPopover;
