import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Link from '~core/Link';
import InfoPopover, { Props as InfoPopoverProps } from '~core/InfoPopover';

import { useUserQuery, useUserAddressQuery } from '~data/index';

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
  popperOptions?: PopperOptions & { showArrow?: boolean };
}

const UserMention = ({
  username,
  to,
  hasLink,
  showInfo,
  popperOptions,
  ...props
}: Props) => {
  const fallbackTo = to || `/user/${username}`;
  const popoverProps: Partial<InfoPopoverProps> = {
    popperOptions,
    trigger: showInfo ? 'click' : 'disabled',
    showArrow: popperOptions && popperOptions.showArrow,
  };

  const { data: userAddressData } = useUserAddressQuery({
    variables: {
      name: username || '',
    },
  });

  const { data } = useUserQuery({
    variables: { address: userAddressData?.userAddress || '' },
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
