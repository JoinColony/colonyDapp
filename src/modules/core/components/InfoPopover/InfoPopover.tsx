import React, { ReactNode, useMemo } from 'react';
import { PopperProps } from 'react-popper';

import Popover from '~core/Popover';
import { AnyUser, AnyToken } from '~data/index';
import { Address } from '~types/index';

import MemberInfoPopover from './MemberInfoPopover';
import TokenInfoPopover from './TokenInfoPopover';
import UserInfoPopover from './UserInfoPopover';

interface TokenContentProps {
  isTokenNative?: boolean;
  token?: AnyToken;
}

interface BasicUserContentProps {
  user?: AnyUser;
}

interface MemberContentProps {
  colonyAddress?: Address;
  domainId?: number | undefined;
  user?: AnyUser;
}

type ContentProps =
  | TokenContentProps
  | BasicUserContentProps
  | MemberContentProps;

export type Props = ContentProps & {
  /** Children elemnts or components to wrap the tooltip around */
  children?: ReactNode;
  /** Passed onto `Popover` component */
  popperProps?: Omit<PopperProps, 'children'>;
  /** How the popover gets triggered */
  trigger?: 'hover' | 'click' | 'disabled';
  /** Show an arrow around on the side of the popover */
  showArrow?: boolean;
};

const displayName = 'InfoPopover';

const InfoPopover = ({
  children,
  popperProps,
  trigger = 'click',
  showArrow = true,
  ...contentProps
}: Props) => {
  const renderContent = useMemo(() => {
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
    if ('user' in contentProps) {
      if (typeof contentProps.user !== 'undefined') {
        const { user } = contentProps;
        return <UserInfoPopover user={user} />;
      }
      return <UserInfoPopover userNotAvailable />;
    }
    return null;
  }, [contentProps]);

  return (
    <Popover
      content={renderContent}
      popperProps={popperProps}
      trigger={trigger}
      showArrow={showArrow}
    >
      {children}
    </Popover>
  );
};

InfoPopover.displayName = displayName;

export default InfoPopover;
