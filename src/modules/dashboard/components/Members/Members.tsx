import React, { FC } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ROLES_COMMUNITY } from '~constants';
import MembersList from '~core/MembersList';
import { SpinnerLoader } from '~core/Preloaders';
import {
  useColonySubscribedUsersQuery,
  AnyUser,
  Colony,
} from '~data/index';
import { sortObjectsBy } from '~utils/arrays';
import { useTransformer } from '~utils/hooks';

import { getCommunityRoles } from '../../../transformers';

import styles from './Members.css';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.Members.loading',
    defaultMessage: "Loading Colony's users...",
  },
});

interface Props {
  colony: Colony;
}

enum Roles {
  Founder = 'founder',
  Admin = 'admin',
  Member = 'member',
}

type CommunityUser = AnyUser & {
  communityRole: Roles;
};

const displayName = 'dashboard.Members';

const Members = ({ colony }: Props) => {
  const {
    data: colonySubscribedUsers,
    loading: loadingColonySubscribedUsers,
  } = useColonySubscribedUsersQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
  });

  const communityRoles = useTransformer(getCommunityRoles, [colony]);

  if (!colonySubscribedUsers || loadingColonySubscribedUsers) {
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

  const communityUsers: CommunityUser[] = subscribedUsers
    .map((user) => {
      const {
        profile: { walletAddress: userAddress },
      } = user;
      let communityRole = Roles.Member;
      if (communityRoles.founder === userAddress) {
        communityRole = Roles.Founder;
      }
      if (
        communityRoles.admins.find(
          (adminAddress) => adminAddress === userAddress,
        )
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
        compareFn: (role) => {
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

  return (
    <div className={styles.main}>
      <MembersList<CommunityUser>
        colonyAddress={colony.colonyAddress}
        extraItemContent={({ communityRole }) => (
          <span className={styles.communityRole}>
            <FormattedMessage id={ROLES_COMMUNITY[communityRole]} />
          </span>
        )}
        domainId={undefined}
        users={communityUsers}
      />
    </div>
  );
};

Members.displayName = displayName;

export default Members as FC<Props>;
