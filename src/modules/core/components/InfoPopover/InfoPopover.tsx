import React, { ReactNode, useMemo } from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Popover from '~core/Popover';
import { AnyUser, AnyToken, Colony } from '~data/index';

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
  colony?: Colony;
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
  popperOptions?: PopperOptions;
  /** How the popover gets triggered */
  trigger?: 'hover' | 'click' | 'disabled';
  /** Show an arrow around on the side of the popover */
  showArrow?: boolean;
  banned?: boolean;
};

const displayName = 'InfoPopover';

const InfoPopover = ({
  children,
  popperOptions,
  trigger = 'click',
  showArrow = true,
  banned = false,
  ...contentProps
}: Props) => {
  const renderContent = useMemo(() => {
    if (
      'colony' in contentProps &&
      typeof contentProps.colony !== 'undefined'
    ) {
      const { colony, domainId, user } = contentProps;
      return (
        <MemberInfoPopover
          colony={colony}
          domainId={domainId}
          user={user}
          banned={banned}
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
  }, [banned, contentProps]);

  return (
    <Popover
      content={renderContent}
      popperOptions={popperOptions}
      trigger={trigger}
      showArrow={showArrow}
    >
      {children}
    </Popover>
  );
};

InfoPopover.displayName = displayName;

export default InfoPopover;
