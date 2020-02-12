import React, { ReactNode } from 'react';

import { Address } from '~types/index';
import { AnyUser, AnyToken } from '~data/index';

import { Tooltip } from '~core/Popover';
import UserMention from '~core/UserMention';
import CopyableAddress from '~core/CopyableAddress';

import styles from './InfoPopover.css';

const componentDisplayName = 'InfoPopover';

interface Props {
  /** Children elemnts or components to wrap the tooltip around */
  children?: ReactNode;
  /** The complete user object, optional */
  user?: AnyUser;
  /** The complete token object, optional */
  token?: AnyToken;
  /** Used in conjuction with `token` to be able to display a user message informing that we're dealing with a native token */
  /*
   * @NOTE This is used because we don't really (and can't really) have a proper method to check if a token is native or not
   *
   * One way to do it, would be to create a query that looks through all the colonies and see if the current token is listed
   * as a native token for that colony
   *
   * I opted for the alternative, since all the instances we wish to display this we already have the colony data, and we can
   * just check for this
   */
  isTokenNative?: boolean;
  /** How the popover gets triggered */
  trigger?: 'hover' | 'click' | 'disabled';
}

interface ConditionalTooltipProps {
  user?: AnyUser;
  token?: AnyToken;
  isTokenNative?: boolean;
}

interface UserTooltipProps {
  displayName?: string | null;
  username?: string | null;
  walletAddress: Address;
}

interface TokenTooltipProps {
  name?: string | null;
  symbol?: string | null;
  address: Address;
  isTokenNative: boolean;
}

const userTooltipContent = ({
  displayName,
  username,
  walletAddress,
}: UserTooltipProps) => (
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

const tokenTooltipContent = ({
  name,
  symbol,
  address,
  isTokenNative,
}: TokenTooltipProps) => (
  <div className={styles.main}>
    {name && (
      <p title={name} className={styles.displayName}>
        {name}
      </p>
    )}
    {symbol && (
      <p title={symbol} className={styles.symbol}>
        {symbol}
      </p>
    )}
    <div title={address} className={styles.address}>
      <CopyableAddress full>{address}</CopyableAddress>
    </div>
  </div>
);

const conditionallyRenderContent = ({
  user,
  token,
  isTokenNative,
}: ConditionalTooltipProps) => {
  if (user) {
    const { displayName, username, walletAddress } = user.profile;
    return userTooltipContent({
      displayName,
      username,
      walletAddress,
    });
  }
  if (token) {
    const { name, symbol, address } = token;
    console.log(token);
    console.log(isTokenNative);
    return tokenTooltipContent({
      name,
      symbol,
      address,
      isTokenNative,
    });
  }
  return null;
};

const InfoPopover = ({
  user,
  token,
  isTokenNative = false,
  children,
  trigger = 'click',
}: Props) => {
  return (
    <Tooltip
      content={conditionallyRenderContent({ user, token, isTokenNative })}
      trigger={user || token ? trigger : 'disabled'}
      darkTheme={false}
    >
      {children}
    </Tooltip>
  );
};

InfoPopover.displayName = componentDisplayName;

export default InfoPopover;
