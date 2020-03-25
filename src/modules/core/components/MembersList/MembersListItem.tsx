import React, { KeyboardEvent, ReactNode, useCallback, useMemo } from 'react';

import UserMention from '~core/UserMention';
import { ListGroupItem } from '~core/ListGroup';
import { AnyUser } from '~data/index';
import { Address, ENTER } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { getMainClasses } from '~utils/css';

import styles from './MembersListItem.css';

interface Props<U> {
  extraItemContent?: (user: U) => ReactNode;
  colonyAddress: Address;
  onRowClick?: (user: U) => void;
  showUserInfo: boolean;
  skillId: number | undefined;
  user: U;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const componentDisplayName = 'MembersList.MembersListItem';

const MembersListItem = <U extends AnyUser = AnyUser>(props: Props<U>) => {
  const {
    extraItemContent,
    colonyAddress,
    onRowClick,
    showUserInfo,
    skillId,
    user,
  } = props;
  const {
    profile: { displayName, username, walletAddress },
  } = user;

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
        <div className={styles.avatarSection}>
          <UserAvatar
            size="xs"
            colonyAddress={colonyAddress}
            address={walletAddress}
            user={user}
            showInfo={!onRowClick || showUserInfo}
            skillId={skillId}
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
            <span>{walletAddress}</span>
          </span>
        </div>
        {renderedExtraItemContent && (
          <div className={styles.section}>{renderedExtraItemContent}</div>
        )}
      </div>
    </ListGroupItem>
  );
};

MembersListItem.displayName = componentDisplayName;

export default MembersListItem;
