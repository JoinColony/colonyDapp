import React, {
  KeyboardEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { AddressZero } from 'ethers/constants';
import { defineMessages } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import UserMention from '~core/UserMention';
import { ListGroupItem } from '~core/ListGroup';
import MemberReputation from '~core/MemberReputation';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import MaskedAddress from '~core/MaskedAddress';
import IconTooltip from '~core/IconTooltip';
import { Member } from '~dashboard/Members';

import HookedUserAvatar from '~users/HookedUserAvatar';
import { AnyUser, Colony, useUser } from '~data/index';
import { ENTER } from '~types/index';
import { getMainClasses } from '~utils/css';

import MemberActions from './Actions';
import { createAddress } from '~utils/web3';

import { query700 as query } from '~styles/queries.css';
import styles from './MembersListItem.css';

interface Props {
  extraItemContent?: (user: Member | AnyUser) => ReactNode;
  colony: Colony;
  onRowClick?: (user: Member | AnyUser) => void;
  showUserInfo: boolean;
  showUserReputation: boolean;
  domainId: number | undefined;
  canAdministerComments?: boolean;
  user: Member | AnyUser;
}

const MSG = defineMessages({
  whitelistedTooltip: {
    id: 'core.MembersList.MembersListItem.whitelistedTooltip',
    defaultMessage: `Added to address book`,
  },
});

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const componentDisplayName = 'MembersList.MembersListItem';

const MembersListItem = (props: Props) => {
  const {
    colony,
    domainId,
    extraItemContent,
    onRowClick,
    showUserInfo,
    showUserReputation,
    user,
    canAdministerComments,
  } = props;
  const {
    profile: { walletAddress },
    banned = false,
    isWhitelisted = false,
  } = user as AnyUser & { banned: boolean; isWhitelisted: boolean };

  const isUserBanned = useMemo(
    () =>
      canAdministerComments !== undefined
        ? canAdministerComments && banned
        : banned,
    [banned, canAdministerComments],
  );

  const userProfile = useUser(createAddress(walletAddress || AddressZero));

  // Determine when reputation has loaded
  const [reputationLoaded, setReputationLoaded] = useState<boolean>(false);

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

  const nativeToken = colony.tokens.find(
    (token) => token.address === colony.nativeTokenAddress,
  );
  const isMobile = useMediaQuery({ query });

  return (
    <ListGroupItem>
      {/* Disable, as `role` is conditional */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={getMainClasses({}, styles, {
          hasCallbackFn: !!onRowClick,
          hasReputation: showUserReputation,
          reputationLoaded,
        })}
        onClick={onRowClick ? handleRowClick : undefined}
        onKeyDown={onRowClick ? handleRowKeydown : undefined}
        role={onRowClick ? 'button' : undefined}
        // Disable, as `tabIndex` is conditional
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={onRowClick ? 0 : undefined}
      >
        <div className={styles.section}>
          <UserAvatar
            size="s"
            colony={colony}
            address={walletAddress}
            user={userProfile}
            showInfo={!onRowClick || showUserInfo}
            domainId={domainId}
            notSet={false}
            banned={isUserBanned}
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
            <InvisibleCopyableAddress address={walletAddress}>
              <MaskedAddress address={walletAddress} />
            </InvisibleCopyableAddress>
            {isWhitelisted && (
              <IconTooltip
                icon="check-mark"
                tooltipText={MSG.whitelistedTooltip}
                tooltipClassName={styles.whitelistedIconTooltip}
                appearance={{ size: 'medium' }}
                className={styles.whitelistedIcon}
              />
            )}
          </div>
        </div>
        {renderedExtraItemContent && !isMobile && (
          <div>{renderedExtraItemContent}</div>
        )}
        {showUserReputation && (
          <div className={styles.reputationSection}>
            <MemberReputation
              walletAddress={walletAddress}
              colonyAddress={colony.colonyAddress}
              domainId={domainId}
              onReputationLoaded={setReputationLoaded}
              showReputationPoints
              nativeTokenDecimals={nativeToken?.decimals}
            />
          </div>
        )}
        <MemberActions
          canAdministerComments={canAdministerComments}
          colony={colony}
          userAddress={walletAddress}
          isWhitelisted={isWhitelisted}
          isBanned={isUserBanned}
        />
      </div>
    </ListGroupItem>
  );
};

MembersListItem.displayName = componentDisplayName;

export default MembersListItem;
