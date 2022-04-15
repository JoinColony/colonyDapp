import React, { FC, useState, useMemo, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';
import { useParams } from 'react-router-dom';

import MembersList from '~core/MembersList';
import { SpinnerLoader } from '~core/Preloaders';
import LoadMoreButton from '~core/LoadMoreButton';
import UserPermissions from '~dashboard/UserPermissions';
import Heading from '~core/Heading';
import { Select, Form } from '~core/Fields';
import { useTransformer } from '~utils/hooks';
import { createAddress } from '~utils/web3';
import {
  AnyUser,
  Colony,
  useColonyMembersWithReputationQuery,
  useMembersSubscription,
  useLoggedInUser,
  BannedUsersQuery,
  useColonyFromNameQuery,
  useVerifiedUsersQuery,
} from '~data/index';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  ALLDOMAINS_DOMAIN_SELECTION,
} from '~constants';
import { Address } from '~types/index';
import {
  getAllUserRolesForDomain,
  getAllUserRoles,
} from '~modules/transformers';
import { hasRoot, canAdminister } from '~modules/users/checks';

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
  bannedUsers: BannedUsersQuery['bannedUsers'];
}

type Member = AnyUser & {
  roles: ColonyRole[];
  directRoles: ColonyRole[];
  banned: boolean;
  isWhitelisted: boolean;
};

const displayName = 'dashboard.Members';

const ITEMS_PER_PAGE = 30;

const Members = ({ colony: { colonyAddress }, colony, bannedUsers }: Props) => {
  const { domainId } = useParams<{
    domainId: string;
  }>();

  const {
    walletAddress: currentUserWalletAddress,
    username,
    ethereal,
  } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;

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
  const [dataPage, setDataPage] = useState<number>(1);

  const selectedDomain = colony.domains.find(
    ({ ethDomainId }) => ethDomainId === selectedDomainId,
  );

  /*
   * Identify users who are whitelisted
   */

  const { data: colonyData } = useColonyFromNameQuery({
    variables: { name: colony.colonyName, address: colonyAddress },
  });

  const { data: verifiedAddresses } = useVerifiedUsersQuery({
    variables: {
      verifiedAddresses:
        colonyData?.processedColony?.whitelistedAddresses || [],
    },
  });

  const storedVerifiedRecipients = useMemo(
    () =>
      (verifiedAddresses?.verifiedUsers || []).map(
        (user) => user?.profile.walletAddress,
      ),
    [verifiedAddresses],
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
      domainId:
        currentDomainId !== COLONY_TOTAL_BALANCE_DOMAIN_ID
          ? currentDomainId
          : ROOT_DOMAIN_ID,
    },
  });

  const currentUserRoles = useTransformer(getAllUserRoles, [
    colony,
    currentUserWalletAddress,
  ]);
  const canAdministerComments =
    hasRegisteredProfile &&
    (hasRoot(currentUserRoles) || canAdminister(currentUserRoles));

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
      membersWithReputation?.colonyMembersWithReputation?.map((walletAddress) =>
        createAddress(walletAddress),
      ) || [];
    if (currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
      const membersWithoutReputation =
        allMembers?.subscribedUsers.map(({ profile: { walletAddress } }) =>
          createAddress(walletAddress),
        ) || [];
      displayMembers = [
        ...new Set([...displayMembers, ...membersWithoutReputation]),
      ];
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

  const handleDataPagination = useCallback(() => {
    setDataPage(dataPage + 1);
  }, [dataPage]);

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

  /*
   * @NOTE Poor man's pagination
   *
   * We're not really doing proper pagination like we do for say... `ColonyEvents`,
   * because our metadata server doesn't support skip, first, more, next, etc...
   * query filters
   *
   * A proper solution for this would be to teach the server to return just part
   * of the results, with the next waiting in line for a callback, but the current
   * timeframe doesn't allow for this, so I guess this is the "best" we can do for now
   */
  const paginatedSkelethonUsers = skelethonUsers.slice(
    0,
    ITEMS_PER_PAGE * dataPage,
  );

  const members: Member[] = paginatedSkelethonUsers.map((user) => {
    const {
      profile: { walletAddress },
    } = user;
    const isUserBanned = bannedUsers.find(
      ({
        id: bannedUserWalletAddress,
        banned,
      }: {
        id: Address;
        banned: boolean;
      }) =>
        banned &&
        createAddress(bannedUserWalletAddress) === createAddress(walletAddress),
    );
    const domainRole = domainRolesArray.find(
      (rolesObject) =>
        createAddress(rolesObject.userAddress) === createAddress(walletAddress),
    );
    const isWhitelisted = storedVerifiedRecipients.find(
      (whitelistedUser) =>
        whitelistedUser &&
        createAddress(whitelistedUser) === createAddress(walletAddress),
    );
    return {
      ...user,
      roles: domainRole ? domainRole.roles : [],
      directRoles: domainRole ? domainRole.directRoles : [],
      banned: canAdministerComments ? !!isUserBanned : false,
      isWhitelisted:
        isWhitelisted && colonyData?.processedColony?.isWhitelistActivated
          ? !!isWhitelisted
          : false,
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
          extraItemContent={({ roles, directRoles, banned }) => (
            <UserPermissions
              roles={roles}
              directRoles={directRoles}
              banned={banned}
            />
          )}
          domainId={currentDomainId}
          users={members}
        />
      ) : (
        <FormattedMessage {...MSG.failedToFetch} />
      )}
      {ITEMS_PER_PAGE * dataPage < skelethonUsers.length && (
        <LoadMoreButton
          onClick={handleDataPagination}
          isLoadingData={
            loadingAllMembers || loadingColonyMembersWithReputation
          }
        />
      )}
    </div>
  );
};

Members.displayName = displayName;

export default Members as FC<Props>;
