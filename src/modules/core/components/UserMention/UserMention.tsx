import React from 'react';
import { PopperProps } from 'react-popper';

import Link from '~core/Link';
import InfoPopover, { Props as InfoPopoverProps } from '~core/InfoPopover';

import { useUserAddressFetcher } from '../../../users/hooks';
import { useUserQuery } from '~data/index';

import styles from './UserMention.css';

interface Props {
  /** A user's username (ENS) */
  username: string;

  /** Alternate place to link to. Defaults to user profile */
  to?: string;

  /** Either just display mention or link to profile or so  */
  hasLink?: boolean;

  /** Html title attribute  */
  title?: string;

  /** Whether to show or not show the InfoPopover tooltip over the avatar */
  showInfo?: boolean;

  /** Passed on to the `Popper` component */
  popperProps?: Omit<PopperProps, 'children'> & { showArrow?: boolean };
}

const UserMention = ({
  username,
  to,
  hasLink,
  showInfo,
  popperProps,
  ...props
}: Props) => {
  const fallbackTo = to || `/user/${username}`;
  const popoverProps: Partial<InfoPopoverProps> = {
    popperProps,
    trigger: showInfo ? 'click' : 'disabled',
    showArrow: popperProps && popperProps.showArrow,
  };

  const { userAddress } = useUserAddressFetcher(username);

  const { data } = useUserQuery({
    variables: { address: userAddress || '' },
  });

  const renderUserMention = () =>
    hasLink ? (
      <Link
        to={fallbackTo}
        text={`@${username}`}
        className={styles.mention}
        {...props}
      />
    ) : (
      <span className={styles.mention} {...props}>
        {' '}
        {`@${username}`}
      </span>
    );

  if (!showInfo) {
    return renderUserMention();
  }

  const { user } = data || {};

  return (
    <InfoPopover user={user} {...popoverProps}>
      {renderUserMention()}
    </InfoPopover>
  );
};

export default UserMention;
