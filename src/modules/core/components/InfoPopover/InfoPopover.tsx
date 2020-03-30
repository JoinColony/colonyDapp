import React, { ReactNode } from 'react';
import { PopperProps } from 'react-popper';

import Popover from '~core/Popover';
import { AnyUser, AnyToken } from '~data/index';
import { Address } from '~types/index';

import MemberInfoPopover from './MemberInfoPopover';
import TokenInfoPopover from './TokenInfoPopover';
import UserInfoPopover from './UserInfoPopover';

interface TokenContentProps {
  isTokenNative: boolean;
  token: AnyToken;
}

interface BasicUserContentProps {
  user: AnyUser;
}

interface MemberContentProps {
  colonyAddress: Address;
  domainId: number | undefined;
  user: AnyUser;
}

type ContentProps =
  | TokenContentProps
  | BasicUserContentProps
  | MemberContentProps;

export type Props = ContentProps & {
  /** Children elemnts or components to wrap the tooltip around */
  children?: ReactNode;
  /** Passed onto `Popover` component */
  popperProps?: PopperProps;
  /** How the popover gets triggered */
  trigger?: 'hover' | 'click' | 'disabled';
};

const displayName = 'InfoPopover';

const renderContent = (contentProps: ContentProps) => {
  /**
   * Use exhaustive checks to satisfy both TS & graphql (each in their own way)
   */
  if (
    'colonyAddress' in contentProps &&
    typeof contentProps.colonyAddress !== 'undefined'
  ) {
    const { colonyAddress, domainId, user } = contentProps;
    return (
      <MemberInfoPopover
        colonyAddress={colonyAddress}
        domainId={domainId}
        user={user}
      />
    );
  }
  if ('token' in contentProps && typeof contentProps.token !== 'undefined') {
    const { isTokenNative, token } = contentProps;
    return <TokenInfoPopover token={token} isTokenNative={!!isTokenNative} />;
  }
  if ('user' in contentProps && typeof contentProps.user !== 'undefined') {
    const { user } = contentProps;
    return <UserInfoPopover user={user} />;
  }
  return null;
};

const InfoPopover = ({
  children,
  popperProps,
  trigger = 'click',
  ...contentProps
}: Props) => {
  return (
    <Popover
      content={renderContent(contentProps)}
      popperProps={popperProps}
      trigger={trigger}
    >
      {children}
    </Popover>
  );
};

InfoPopover.displayName = displayName;

export default InfoPopover;
