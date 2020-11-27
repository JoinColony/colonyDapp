import React, { FC, useState, useMemo, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';

import MembersList from '~core/MembersList';
import { SpinnerLoader } from '~core/Preloaders';
import UserPermissions from '~admin/Permissions/UserPermissions';
import Heading from '~core/Heading';
import { Select, Form } from '~core/Fields';

import { getAllUserRolesForDomain } from '../../../transformers';
import { useTransformer } from '~utils/hooks';
import { useColonySubscribedUsersQuery, AnyUser, Colony } from '~data/index';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  ALLDOMAINS_DOMAIN_SELECTION,
} from '~constants';

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
      other {: {domainLabel}}
    }`,
  },
  labelFilter: {
    id: 'dashboard.Members.labelFilter',
    defaultMessage: 'Filter',
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
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );
  const {
    data: colonySubscribedUsers,
    loading: loadingColonySubscribedUsers,
  } = useColonySubscribedUsersQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
  });

  const domainRoles = useTransformer(getAllUserRolesForDomain, [
    colony,
    selectedDomainId,
  ]);

  const directDomainRoles = useTransformer(getAllUserRolesForDomain, [
    colony,
    selectedDomainId,
    true,
  ]);

  const domainSelectOptions = sortBy(
    [...colony.domains, ALLDOMAINS_DOMAIN_SELECTION].map(
      ({ ethDomainId, name }) => ({
        value: ethDomainId.toString(),
        label: name,
      }),
    ),
    ['value'],
  );

  const setFieldValue = useCallback(
    (value) => setSelectedDomainId(parseInt(value, 10)),
    [setSelectedDomainId],
  );

  const domainRolesArray = useMemo(() => {
    if (selectedDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
      return [];
    }
    return domainRoles
      .sort(({ roles }) => (roles.includes(ColonyRole.Root) ? -1 : 1))
      .filter(({ roles }) => !!roles.length)
      .map(({ address, roles }) => {
        const directUserRoles = directDomainRoles.find(
          ({ address: userAddress }) => userAddress === address,
        );
        return {
          userAddress: address,
          roles,
          directRoles: directUserRoles ? directUserRoles.roles : [],
        };
      });
  }, [directDomainRoles, domainRoles, selectedDomainId]);

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

  const members: Member[] = subscribedUsers.map((user) => {
    const {
      profile: { walletAddress },
    } = user;
    const domainRole = domainRolesArray.find(
      (rolesObject) => rolesObject.userAddress === walletAddress,
    );
    return {
      ...user,
      roles: domainRole ? domainRole.roles : [],
      directRoles: domainRole ? domainRole.directRoles : [],
    };
  });

  const selectedDomain = colony.domains.find(
    ({ ethDomainId }) => ethDomainId === selectedDomainId,
  );

  return (
    <div className={styles.main}>
      <div className={styles.titleContainer}>
        <Heading
          text={MSG.title}
          textValues={{
            domainLabel: selectedDomain
              ? selectedDomain.name
              : ALLDOMAINS_DOMAIN_SELECTION.name,
          }}
          appearance={{ size: 'medium', theme: 'dark' }}
        />
        <Form
          initialValues={{ filter: COLONY_TOTAL_BALANCE_DOMAIN_ID.toString() }}
          onSubmit={() => {}}
        >
          <Select
            appearance={{
              alignOptions: 'right',
              theme: 'alt',
            }}
            elementOnly
            label={MSG.labelFilter}
            name="filter"
            onChange={setFieldValue}
            options={domainSelectOptions}
          />
        </Form>
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
