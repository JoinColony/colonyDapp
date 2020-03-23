import React, { ReactNode } from 'react';

import Popover from '~core/Popover';
import { AnyUser, AnyToken } from '~data/index';
import { Address } from '~types/index';

import UserInfoPopover from './UserInfoPopover';
import TokenInfoPopover from './TokenInfoPopover';

interface Props {
  /** Children elemnts or components to wrap the tooltip around */
  children?: ReactNode;
  /** Used for the userinfopopover (displaying reputation) */
  colonyAddress?: Address;
  /** Used in conjuction with `token` to be able to display a user message informing that we're dealing with a native token */
  isTokenNative?: boolean;
  /** Used for the userinfopopover (displaying reputation) */
  skillId?: number;
  /** The complete token object, optional */
  token?: AnyToken;
  /** How the popover gets triggered */
  trigger?: 'hover' | 'click' | 'disabled';
  /** The complete user object, optional */
  user?: AnyUser;
}

interface ContentProps {
  colonyAddress?: Address;
  isTokenNative: boolean;
  skillId?: number;
  token?: AnyToken;
  user?: AnyUser;
}

const displayName = 'InfoPopover';

const renderContent = ({
  colonyAddress,
  isTokenNative,
  skillId,
  token,
  user,
}: ContentProps) => {
  if (user) {
    if (colonyAddress) {
      // exhaustive checks to satisfy discriminate union
      return (
        <UserInfoPopover
          colonyAddress={colonyAddress}
          skillId={skillId}
          user={user}
        />
      );
    }
    return <UserInfoPopover user={user} />;
  }

  if (token) {
    return <TokenInfoPopover token={token} isTokenNative={isTokenNative} />;
  }

  return null;
};

const InfoPopover = ({
  children,
  colonyAddress,
  isTokenNative = false,
  skillId,
  token,
  trigger = 'click',
  user,
}: Props) => {
  return (
    <Popover
      content={renderContent({
        colonyAddress,
        isTokenNative,
        skillId,
        token,
        user,
      })}
      trigger={user || token ? trigger : 'disabled'}
    >
      {children}
    </Popover>
  );
};

InfoPopover.displayName = displayName;

export default InfoPopover;
