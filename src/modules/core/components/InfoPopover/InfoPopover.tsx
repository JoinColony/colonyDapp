import React, { ReactNode } from 'react';

import { AnyUser, AnyToken } from '~data/index';

import { Tooltip } from '~core/Popover';

import UserInfoPopover from './UserInfoPopover';
import TokenInfoPopover from './TokenInfoPopover';

interface Props {
  /** Children elemnts or components to wrap the tooltip around */
  children?: ReactNode;
  /** The complete user object, optional */
  user?: AnyUser;
  /** The complete token object, optional */
  token?: AnyToken;
  /** Used in conjuction with `token` to be able to display a user message informing that we're dealing with a native token */
  isTokenNative?: boolean;
  /** How the popover gets triggered */
  trigger?: 'hover' | 'click' | 'disabled';
}

interface ContentProps {
  user?: AnyUser;
  token?: AnyToken;
  isTokenNative: boolean;
}

const displayName = 'InfoPopover';

const renderContent = ({ user, token, isTokenNative }: ContentProps) => {
  if (user) return <UserInfoPopover user={user} />;

  if (token) {
    return <TokenInfoPopover token={token} isTokenNative={isTokenNative} />;
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
      content={renderContent({ user, token, isTokenNative })}
      trigger={user || token ? trigger : 'disabled'}
      darkTheme={false}
    >
      {children}
    </Tooltip>
  );
};

InfoPopover.displayName = displayName;

export default InfoPopover;
