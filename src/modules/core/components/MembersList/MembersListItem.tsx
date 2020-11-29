import React, { KeyboardEvent, ReactNode, useCallback, useMemo } from 'react';

import { defineMessages } from 'react-intl';
import UserMention from '~core/UserMention';
import { ListGroupItem } from '~core/ListGroup';
import { AnyUser, useUserReputationQuery, useUser } from '~data/index';
import { Address, ENTER } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { getMainClasses } from '~utils/css';
import MaskedAddress from '~core/MaskedAddress';
import Numeral from '~core/Numeral';
import { useTokenInfo } from '~utils/hooks';
import Icon from '~core/Icon';

import styles from './MembersListItem.css';

const MSG = defineMessages({
  starReputationTitle: {
    id: 'MembersList.MembersListItem.starReputationTitle',
    defaultMessage: `User reputation value: {reputation}`,
  },
});

interface Props<U> {
  extraItemContent?: (user: U) => ReactNode;
  colonyAddress: Address;
  onRowClick?: (user: U) => void;
  showUserInfo: boolean;
  domainId: number | undefined;
  user: U;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const componentDisplayName = 'MembersList.MembersListItem';

const MembersListItem = <U extends AnyUser = AnyUser>(props: Props<U>) => {
  const {
    colonyAddress,
    domainId,
    extraItemContent,
    onRowClick,
    showUserInfo,
    user,
  } = props;
  const {
    profile: { walletAddress },
  } = user;

  const userProfile = useUser(walletAddress);

  const { data: userReputationData } = useUserReputationQuery({
    variables: { address: walletAddress, colonyAddress, domainId },
  });

  // Refactor MemberInfoPopover to use this hook if works fine after reputation tests
  const { tokenInfoData } = useTokenInfo();

  const handleRowClick = useCallback(() => {
    if (onRowClick) {
      onRowClick(user);
    }
  }, [onRowClick, user]);
  const handleRowKeydown = useCallback(
    (evt: KeyboardEvent<HTMLDivElement>) => {
      if (onRowClick && evt.key === ENTER) {
        onRowClick(user);
      }
    },
    [onRowClick, user],
  );

  const renderedExtraItemContent = useMemo(
    () => (extraItemContent ? extraItemContent(user) : null),
    [extraItemContent, user],
  );

  const {
    profile: { displayName, username },
  } = userProfile;

  return (
    <ListGroupItem>
      {/* Disable, as `role` is conditional */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={getMainClasses({}, styles, { hasCallbackFn: !!onRowClick })}
        onClick={onRowClick ? handleRowClick : undefined}
        onKeyDown={onRowClick ? handleRowKeydown : undefined}
        role={onRowClick ? 'button' : undefined}
        // Disable, as `tabIndex` is conditional
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={onRowClick ? 0 : undefined}
      >
        {userReputationData && tokenInfoData && (
          <div className={styles.reputationSection}>
            <Numeral
              className={styles.reputation}
              appearance={{ theme: 'primary' }}
              value={userReputationData.userReputation}
              unit={tokenInfoData.tokenInfo.decimals}
            />
            <Icon
              name="star"
              appearance={{ size: 'extraTiny' }}
              className={styles.icon}
              title={MSG.starReputationTitle}
              titleValues={{
                reputation: userReputationData.userReputation,
              }}
            />
          </div>
        )}
        <div className={styles.section}>
          <UserAvatar
            size="s"
            colonyAddress={colonyAddress}
            address={walletAddress}
            user={userProfile}
            showInfo={!onRowClick || showUserInfo}
            domainId={domainId}
            notSet={false}
          />
        </div>
        <div className={styles.usernameSection}>
          {displayName && (
            <span className={styles.displayName} title={displayName}>
              {displayName}
            </span>
          )}
          {username && (
            <span className={styles.username}>
              <UserMention hasLink={false} username={username} />
            </span>
          )}
          <span className={styles.address}>
            <MaskedAddress address={walletAddress} />
          </span>
        </div>
        {renderedExtraItemContent && <div>{renderedExtraItemContent}</div>}
      </div>
    </ListGroupItem>
  );
};

MembersListItem.displayName = componentDisplayName;

export default MembersListItem;
