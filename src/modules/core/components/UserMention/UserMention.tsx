import React from 'react';
import { PopperProps } from 'react-popper';

import Link from '~core/Link';
import InfoPopover, { Props as InfoPopoverProps } from '~core/InfoPopover';

import { useUserAddressFetcher } from '../../../users/hooks';
import { useUserQuery } from '~data/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

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
  popperProps?: PopperProps & { showArrow?: boolean };
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

  const { userAddress, error: userAddressError } = useUserAddressFetcher(
    username,
  );

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

  if (!showInfo || !data || !data.user || userAddressError) {
    return renderUserMention();
  }

  const { user } = data;

  return (
    <InfoPopover
      /*
       * @NOTE Colony Address and Domain Id are just used to satify type
       * requirements on InfoPopover, they are not actually used
       */
      colonyAddress=""
      domainId={COLONY_TOTAL_BALANCE_DOMAIN_ID}
      user={user}
      {...popoverProps}
    >
      {renderUserMention()}
    </InfoPopover>
  );
};

export default UserMention;
