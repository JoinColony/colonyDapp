import React, { ReactNode } from 'react';

import { Address } from '~types/index';
import { useSelector } from '~utils/hooks';
import { userSelector } from '../../../users/selectors';

import { Tooltip } from '~core/Popover';
import UserMention from '~core/UserMention';
import CopyableAddress from '~core/CopyableAddress';

import styles from './InfoPopover.css';

const componentDisplayName = 'InfoPopover';

interface Props {
  /** Children elemnts or components to wrap the tooltip around */
  children?: ReactNode;
  /** The address */
  address: Address;
  /** How the popover gets triggered */
  trigger?: 'hover' | 'click' | 'disabled';
}

interface TooltipProps {
  displayName?: string;
  username?: string;
  walletAddress: Address;
}

const renderTooltipContent = ({
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

const InfoPopover = ({ address, children, trigger = 'click' }: Props) => {
  const user = useSelector(userSelector, [address]);
  let username;
  let displayName;
  if (user && user && user.record.profile) {
    username = user.record.profile.username;
    displayName = user.record.profile.displayName;
  }
  return (
    <Tooltip
      content={renderTooltipContent({
        displayName,
        username,
        walletAddress: address,
      })}
      trigger={trigger}
      darkTheme={false}
    >
      {children}
    </Tooltip>
  );
};

InfoPopover.displayName = componentDisplayName;

export default InfoPopover;
