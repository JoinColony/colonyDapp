import React, { FC, useCallback, useState, useRef, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import {
  useColonySubscribedUsersQuery,
  useLoggedInUser,
  useUserColonyAddressesQuery,
  useSubscribeToColonyMutation,
  cacheUpdates,
} from '~data/index';
import { domainsAndRolesFetcher } from '../../fetchers';
import { getCommunityRoles } from '../../../transformers';
import { useDataFetcher, useTransformer } from '~utils/hooks';
import { ROLES_COMMUNITY } from '~constants';
import { sortObjectsBy } from '~utils/arrays';

import { Table, TableBody, TableCell } from '~core/Table';
import { SpinnerLoader } from '~core/Preloaders';
import UserListItem from '~admin/UserListItem';
import Button from '~core/Button';

import styles from './Community.css';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.Community.loading',
    defaultMessage: "Loading Colony's users...",
  },
  callToJoin: {
    id: 'dashboard.Community.callToJoin',
    defaultMessage: `{noMembers, select,
      true {No members yet. {action} to become the first member of this colony.}
      other {{action} to become a member of this colony.}
    }`,
  },
  join: {
    id: 'dashboard.Community.join',
    defaultMessage: `Join now`,
  },
  joined: {
    id: 'dashboard.Community.joined',
    defaultMessage: `{star} Joined!`,
  },
});

interface Props {
  colonyAddress: Address;
}

enum Roles {
  Founder = 'founder',
  Admin = 'admin',
  Member = 'member',
}

const displayName = 'dashboard.Community';

const Community = ({ colonyAddress }: Props) => {
  const [justSubscribed, setJustSubscribed] = useState<boolean>(false);
  const subscribedMessageTimer = useRef<any>(null);
  const { walletAddress } = useLoggedInUser();
  const {
    data: currentUserSubscribedColonies,
    loading: loadingCurrentUserSubscribedColonies,
  } = useUserColonyAddressesQuery({
    variables: { address: walletAddress },
  });
  const {
    data: colonySubscribedUsers,
    loading: loadingColonySubscribedUsers,
  } = useColonySubscribedUsersQuery({
    variables: {
      colonyAddress,
    },
  });
  const [subscribeToColonyMutation] = useSubscribeToColonyMutation();
  const subscribeToColony = useCallback(() => {
    if (colonyAddress) {
      subscribeToColonyMutation({
        variables: { input: { colonyAddress } },
        update: cacheUpdates.subscribeToColony(colonyAddress),
      });
      setJustSubscribed(true);
      subscribedMessageTimer.current = setTimeout(
        () => setJustSubscribed(false),
        3000,
      );
    }
  }, [subscribeToColonyMutation, colonyAddress, setJustSubscribed]);

  /*
   * We need to wrap the call in a second function, since only the returned
   * function gets called on unmount.
   * The first one is only called on render.
   */
  useEffect(() => () => clearTimeout(subscribedMessageTimer.current), [
    subscribedMessageTimer,
  ]);

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const communityRoles = useTransformer(getCommunityRoles, [domains]);

  if (
    !colonySubscribedUsers ||
    loadingColonySubscribedUsers ||
    isFetchingDomains ||
    loadingCurrentUserSubscribedColonies
  ) {
    return (
      <div className={styles.main}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ size: 'massive', theme: 'primary' }}
        />
      </div>
    );
  }

  const {
    colony: { subscribedUsers },
  } = colonySubscribedUsers;

  const communityUsers = subscribedUsers
    .map(user => {
      const {
        profile: { walletAddress: userAddress },
      } = user;
      let communityRole = Roles.Member;
      if (communityRoles.founder === userAddress) {
        communityRole = Roles.Founder;
      }
      if (
        communityRoles.admins.find(adminAddress => adminAddress === userAddress)
      ) {
        communityRole = Roles.Admin;
      }
      return {
        ...user,
        communityRole,
      };
    })
    .sort(
      sortObjectsBy({
        name: 'communityRole',
        compareFn: role => {
          if (role === Roles.Founder) {
            return -1;
          }
          if (role === Roles.Member) {
            return 1;
          }
          return 0;
        },
      }),
    );

  let isSubscribed = false;
  if (currentUserSubscribedColonies) {
    const {
      user: { colonyAddresses },
    } = currentUserSubscribedColonies;
    isSubscribed = (colonyAddresses || []).includes(colonyAddress);
  }

  return (
    <div className={styles.main}>
      {currentUserSubscribedColonies && !isSubscribed && (
        <div className={styles.subscribeCallToAction}>
          <FormattedMessage
            {...MSG.callToJoin}
            values={{
              noMembers: !communityUsers.length,
              action: (
                <Button
                  className={styles.subscribeButton}
                  onClick={subscribeToColony}
                >
                  <span className={styles.unsubscribedIcon} />
                  <FormattedMessage {...MSG.join} />
                </Button>
              ),
            }}
          />
        </div>
      )}
      {justSubscribed && (
        <div className={styles.subscribeCallToAction}>
          <FormattedMessage
            {...MSG.joined}
            values={{
              star: <span className={styles.subscribedIcon} />,
            }}
          />
        </div>
      )}
      <Table scrollable>
        <TableBody className={styles.tableBody}>
          {communityUsers.map(({ id: userAddress, communityRole }) => (
            <UserListItem
              address={userAddress}
              key={userAddress}
              showDisplayName
              showUsername
              showInfo={false}
            >
              <TableCell>
                <span className={styles.communityRole}>
                  <FormattedMessage id={ROLES_COMMUNITY[communityRole]} />
                </span>
              </TableCell>
            </UserListItem>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

Community.displayName = displayName;

export default Community as FC<Props>;
