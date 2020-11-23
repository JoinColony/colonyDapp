import React, { FC, useState, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ROOT_DOMAIN_ID, ColonyRole } from '@colony/colony-js';
import { ROLES_COMMUNITY } from '~constants';
import MembersList from '~core/MembersList';
import { SpinnerLoader } from '~core/Preloaders';
import { useColonySubscribedUsersQuery, AnyUser, Colony } from '~data/index';
import { sortObjectsBy } from '~utils/arrays';
import { useTransformer } from '~utils/hooks';
import {
  getAllUserRolesForDomain,
  getCommunityRoles,
} from '../../../transformers';
import UserPermissions from '~admin/Permissions/UserPermissions';
import Heading from '~core/Heading';

import styles from './Members.css';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.Members.loading',
    defaultMessage: "Loading Colony's users...",
  },
  title: {
    id: 'dashboard.Members.title',
    defaultMessage: `Members{domainLabel, select,
      root {}
      other {: #{domainLabel}}
    }`,
  },
});

interface Props {
  colony: Colony;
}

type Member = AnyUser & {
  roles: ColonyRole[];
  directRoles: ColonyRole[];
};

const displayName = 'dashboard.Members';

const Members = ({ colony }: Props) => {
  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    ROOT_DOMAIN_ID,
  );
  const {
    data: colonySubscribedUsers,
    loading: loadingColonySubscribedUsers,
  } = useColonySubscribedUsersQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
  });

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

  const domainRoles = useTransformer(getAllUserRolesForDomain, [
    colony,
    selectedDomainId,
  ]);

  const directDomainRoles = useTransformer(getAllUserRolesForDomain, [
    colony,
    selectedDomainId,
    true,
  ]);

  const selectedDomain = colony.domains.find(
    ({ ethDomainId }) => ethDomainId === selectedDomainId,
  );

  // Something wrong with types here
  // @ts-ignore
  const members: Member[] = useMemo(
    () =>
      domainRoles
        .sort(({ roles }) => (roles.includes(ColonyRole.Root) ? -1 : 1))
        .filter(({ roles }) => !!roles.length)
        .map(({ address, roles }) => {
          const directUserRoles = directDomainRoles.find(
            ({ address: userAddress }) => userAddress === address,
          );
          const user = subscribedUsers.find(
            ({ profile: { walletAddress: userAddress } }) =>
              userAddress === address,
          );
          return {
            ...user,
            roles,
            directRoles: directUserRoles ? directUserRoles.roles : [],
          };
        }),
    [directDomainRoles, domainRoles],
  );

  return (
    <div className={styles.main}>
      <div className={styles.titleContainer}>
        <Heading
          text={MSG.title}
          textValues={{
            domainLabel: selectedDomain ? selectedDomain.name : undefined,
          }}
          appearance={{ size: 'medium', theme: 'dark' }}
        />
      </div>
      <MembersList<Member>
        colonyAddress={colony.colonyAddress}
        extraItemContent={({ roles, directRoles }) => (
          <UserPermissions roles={roles} directRoles={directRoles} />
        )}
        domainId={undefined}
        users={members}
      />
    </div>
  );
};

Members.displayName = displayName;

export default Members as FC<Props>;
