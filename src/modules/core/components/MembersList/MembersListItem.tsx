import React, { KeyboardEvent, ReactNode, useCallback, useMemo } from 'react';
import { AddressZero } from 'ethers/constants';

import { createAddress } from '~utils/web3';
import UserMention from '~core/UserMention';
import { ListGroupItem } from '~core/ListGroup';
import CopyableAddress from '~core/CopyableAddress';
import { AnyUser, Colony, useUser } from '~data/index';
import { ENTER } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { getMainClasses } from '~utils/css';
import MemberReputation from '~core/MemberReputation';

import styles from './MembersListItem.css';

interface Props<U> {
  extraItemContent?: (user: U) => ReactNode;
  colony: Colony;
  onRowClick?: (user: U) => void;
  showUserInfo: boolean;
  showUserReputation: boolean;
  domainId: number | undefined;
  user: U;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const componentDisplayName = 'MembersList.MembersListItem';

const MembersListItem = <U extends AnyUser = AnyUser>(props: Props<U>) => {
  const {
    colony,
    domainId,
    extraItemContent,
    onRowClick,
    showUserInfo,
    showUserReputation,
    user,
  } = props;
  const {
    profile: { walletAddress },
  } = user;

  const userProfile = useUser(createAddress(walletAddress || AddressZero));

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
        {showUserReputation && (
          <div className={styles.reputationSection}>
            <MemberReputation
              walletAddress={walletAddress}
              colonyAddress={colony.colonyAddress}
              domainId={domainId}
            />
          </div>
        )}
        <div className={styles.section}>
          <UserAvatar
            size="s"
            colony={colony}
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
          <div className={styles.address}>
            <CopyableAddress>{walletAddress}</CopyableAddress>
          </div>
        </div>
        {renderedExtraItemContent && <div>{renderedExtraItemContent}</div>}
      </div>
    </ListGroupItem>
  );
};

MembersListItem.displayName = componentDisplayName;

export default MembersListItem;
