import React, { KeyboardEvent, ReactNode, useCallback, useMemo } from 'react';

import { defineMessages } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import { createAddress } from '~utils/web3';
import UserMention from '~core/UserMention';
import { ListGroupItem } from '~core/ListGroup';
import CopyableAddress from '~core/CopyableAddress';
import { AnyUser, useUserReputationQuery, useUser } from '~data/index';
import { Address, ENTER } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { getMainClasses } from '~utils/css';
import Numeral from '~core/Numeral';
import Icon from '~core/Icon';

import styles from './MembersListItem.css';

const MSG = defineMessages({
  starReputationTitle: {
    id: 'MembersList.MembersListItem.starReputationTitle',
    defaultMessage: `User reputation value: {reputation}`,
  },
  starNoReputationTitle: {
    id: 'MembersList.MembersListItem.starNoReputationTitle',
    defaultMessage: `User has no reputation`,
  },
});

interface Reputation {
  userReputation: string;
}

interface Props<U> {
  extraItemContent?: (user: U) => ReactNode;
  colonyAddress: Address;
  onRowClick?: (user: U) => void;
  showUserInfo: boolean;
  domainId: number | undefined;
  user: U;
  totalReputation: Reputation | undefined;
}

enum ZeroValue {
  Zero = '0',
  NearZero = '~0',
}

type PercentageReputationType = ZeroValue | number | null;

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const calculatePercentageReputation = (
  decimalPlaces: number,
  userReputation?: Reputation,
  totalReputation?: Reputation,
): PercentageReputationType => {
  if (!userReputation || !totalReputation) return null;
  const userReputationNumber = bigNumberify(userReputation.userReputation);
  const totalReputationNumber = bigNumberify(totalReputation.userReputation);

  const reputationSafeguard = bigNumberify(100).pow(decimalPlaces);

  if (userReputationNumber.isZero()) {
    return ZeroValue.Zero;
  }

  if (userReputationNumber.mul(reputationSafeguard).lt(totalReputationNumber)) {
    return ZeroValue.NearZero;
  }

  const reputation = userReputationNumber
    .mul(reputationSafeguard)
    .div(totalReputationNumber)
    .toNumber();

  return reputation / 10 ** decimalPlaces;
};

const DECIMAL_PLACES = 2;

const componentDisplayName = 'MembersList.MembersListItem';

const MembersListItem = <U extends AnyUser = AnyUser>(props: Props<U>) => {
  const {
    colonyAddress,
    domainId,
    extraItemContent,
    onRowClick,
    showUserInfo,
    user,
    totalReputation,
  } = props;
  const {
    profile: { walletAddress },
  } = user;

  const userProfile = useUser(createAddress(walletAddress));

  const { data: userReputationData } = useUserReputationQuery({
    variables: { address: walletAddress, colonyAddress, domainId },
  });

  const userPercentageReputation = calculatePercentageReputation(
    DECIMAL_PLACES,
    userReputationData,
    totalReputation,
  );

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
        <div className={styles.reputationSection}>
          {!userPercentageReputation && (
            <div className={styles.reputation}>— %</div>
          )}
          {userPercentageReputation === ZeroValue.NearZero && (
            <div className={styles.reputation}>{userPercentageReputation}%</div>
          )}
          {userPercentageReputation &&
            userPercentageReputation !== ZeroValue.NearZero && (
              <Numeral
                className={styles.reputation}
                appearance={{ theme: 'primary' }}
                value={userPercentageReputation}
                suffix="%"
              />
            )}
          <Icon
            name="star"
            appearance={{ size: 'extraTiny' }}
            className={styles.icon}
            title={
              userPercentageReputation
                ? MSG.starReputationTitle
                : MSG.starNoReputationTitle
            }
            titleValues={{
              reputation: userPercentageReputation,
            }}
          />
        </div>
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
