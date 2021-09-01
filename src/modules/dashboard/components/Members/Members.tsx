import React, { FC, useState, useMemo, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';
import { useParams } from 'react-router-dom';

import MembersList from '~core/MembersList';
import { SpinnerLoader } from '~core/Preloaders';
import UserPermissions from '~dashboard/UserPermissions';
import Heading from '~core/Heading';
import { Select, Form } from '~core/Fields';

import { getAllUserRolesForDomain } from '../../../transformers';
import { useTransformer } from '~utils/hooks';
import { createAddress } from '~utils/web3';
import {
  AnyUser,
  Colony,
  useColonyMembersWithReputationQuery,
  useMembersSubscription,
} from '~data/index';
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
  failedToFetch: {
    id: 'dashboard.Members.failedToFetch',
    defaultMessage: "Could not fetch the colony's members",
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

const Members = ({ colony: { colonyAddress }, colony }: Props) => {
  const { domainId } = useParams<{
    domainId: string;
  }>();

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    /*
     * @NOTE DomainId param sanitization
     *
     * We don't actually need to worry about sanitizing the domainId that's
     * coming in from the params.
     * The value that reaches us through the hook is being processes by `react-router`
     * and will always be a string.
     *
     * So if we can change that string into a number, we use it as domain, otherwise
     * we fall back to the "All Domains" selection
     */
    parseInt(domainId, 10) || COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const selectedDomain = colony.domains.find(
    ({ ethDomainId }) => ethDomainId === selectedDomainId,
  );

  /*
   * NOTE If we can't find the domain based on the current selected doamain id,
   * it means that it doesn't exist.
   * We then fall back to the to the "All Domains" selection
   *
   * Another alternative would be to redirect here to the /colony/members route
   * but that has the annoying side-effect of flickering the loading spinner
   * a couple of times on the page
   */
  const { ethDomainId: currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID } =
    selectedDomain || {};

  const {
    data: allMembers,
    loading: loadingAllMembers,
  } = useMembersSubscription({
    variables: {
      colonyAddress,
    },
  });

  const {
    data: membersWithReputation,
    loading: loadingColonyMembersWithReputation,
  } = useColonyMembersWithReputationQuery({
    variables: {
      colonyAddress,
      domainId: currentDomainId,
    },
  });

  /*
   * @NOTE Skelethon Users Array
   *
   * This is just  an array of user "profiles" that only contain the user's address.
   * This will be passed down to `MembersListItem` where the final component will do
   * the actual "full" profile fetching.
   *
   * We had to resort to this because otherwise we run into hook callback "hell" while
   * trying to fetch user profiles in a queue for an array of addresses.
   *
   * The opposite is also not possible, to fetch all profiles at once using a query, since
   * this time we need only the members in the colony that have reputation, and that comes
   * from the reputation oracle, which will just return us a list of addresses (which can
   * or cannot be subscribers to the colony).
   */
  const skelethonUsers = useMemo(() => {
    let displayMembers =
      allMembers?.subscribedUsers.map(
        ({ profile: { walletAddress } }) => walletAddress,
      ) || [];
    if (currentDomainId !== COLONY_TOTAL_BALANCE_DOMAIN_ID) {
      displayMembers = membersWithReputation?.colonyMembersWithReputation || [];
    }

    return displayMembers.map((walletAddress) => ({
      id: walletAddress,
      profile: { walletAddress },
    }));
  }, [allMembers, membersWithReputation, currentDomainId]);

  const domainRoles = useTransformer(getAllUserRolesForDomain, [
    colony,
    /*
     * If we have "All Domains" selected show the same permissions as on "Root"
     */
    currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
      ? ROOT_DOMAIN_ID
      : currentDomainId,
  ]);

  const directDomainRoles = useTransformer(getAllUserRolesForDomain, [
    colony,
    /*
     * If we have "All Domains" selected show the same permissions as on "Root"
     */
    currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
      ? ROOT_DOMAIN_ID
      : currentDomainId,
    true,
  ]);

  const inheritedDomainRoles = useTransformer(getAllUserRolesForDomain, [
    colony,
    ROOT_DOMAIN_ID,
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
    return domainRoles
      .sort(({ roles }) => (roles.includes(ColonyRole.Root) ? -1 : 1))
      .filter(({ roles }) => !!roles.length)
      .map(({ address, roles }) => {
        const directUserRoles = directDomainRoles.find(
          ({ address: userAddress }) => userAddress === address,
        );
        const rootRoles = inheritedDomainRoles.find(
          ({ address: userAddress }) => userAddress === address,
        );
        const allUserRoles = [
          ...new Set([
            ...(directUserRoles?.roles || []),
            ...(rootRoles?.roles || []),
          ]),
        ];
        return {
          userAddress: address,
          roles,
          directRoles: allUserRoles,
        };
      });
  }, [directDomainRoles, domainRoles, inheritedDomainRoles]);

  if (loadingAllMembers || loadingColonyMembersWithReputation) {
    return (
      <div className={styles.main}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ size: 'massive', theme: 'primary' }}
        />
      </div>
    );
  }

  const members: Member[] = skelethonUsers.map((user) => {
    const {
      profile: { walletAddress },
    } = user;
    const domainRole = domainRolesArray.find(
      (rolesObject) =>
        createAddress(rolesObject.userAddress) === createAddress(walletAddress),
    );
    return {
      ...user,
      roles: domainRole ? domainRole.roles : [],
      directRoles: domainRole ? domainRole.directRoles : [],
    };
  });

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
          initialValues={{ filter: currentDomainId.toString() }}
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
      {skelethonUsers.length ? (
        <MembersList<Member>
          colony={colony}
          extraItemContent={({ roles, directRoles }) => (
            <UserPermissions roles={roles} directRoles={directRoles} />
          )}
          domainId={currentDomainId}
          users={members}
        />
      ) : (
        <FormattedMessage {...MSG.failedToFetch} />
      )}
    </div>
  );
};

Members.displayName = displayName;

export default Members as FC<Props>;
