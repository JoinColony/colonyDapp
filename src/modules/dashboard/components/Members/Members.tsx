import React, { FC, useState, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';
import { useParams } from 'react-router-dom';

import MembersList from '~core/MembersList';
import { SpinnerLoader } from '~core/Preloaders';
import LoadMoreButton from '~core/LoadMoreButton';
import UserPermissions from '~dashboard/UserPermissions';
import Heading from '~core/Heading';
import { Select, Form } from '~core/Fields';
import { useTransformer } from '~utils/hooks';
import {
  ColonyContributor,
  ColonyWatcher,
  Colony,
  useLoggedInUser,
  BannedUsersQuery,
  useContributorsAndWatchersQuery,
} from '~data/index';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  ALLDOMAINS_DOMAIN_SELECTION,
} from '~constants';
import { getAllUserRoles } from '~modules/transformers';
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

const displayName = 'dashboard.Members';

const ITEMS_PER_PAGE = 1;

const Members = ({ colony: { colonyAddress, colonyName }, colony }: Props) => {
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
  const [dataPage, setDataPage] = useState<number>(10);

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
    data: members,
    loading: loadingMembers,
  } = useContributorsAndWatchersQuery({
    variables: {
      colonyAddress,
      colonyName,
      domainId:
        currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
          ? ROOT_DOMAIN_ID
          : currentDomainId,
    },
  });

  const contributors = members?.contributorsAndWatchers?.contributors || [];
  const watchers = members?.contributorsAndWatchers?.watchers || [];

  const currentUserRoles = useTransformer(getAllUserRoles, [
    colony,
    currentUserWalletAddress,
  ]);
  const canAdministerComments =
    hasRegisteredProfile &&
    (hasRoot(currentUserRoles) || canAdminister(currentUserRoles));

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

  if (loadingMembers) {
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
  const paginatedContributors = contributors.slice(
    0,
    ITEMS_PER_PAGE * dataPage,
  );

  const paginatedWatchers = watchers.slice(0, ITEMS_PER_PAGE * dataPage);

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
      {/* PLACEHOLDER */}
      <div>CONTRIBUTORS</div>
      {contributors.length ? (
        <MembersList<ColonyContributor>
          colony={colony}
          extraItemContent={({ roles, directRoles, banned }) => (
            <UserPermissions
              roles={roles}
              directRoles={directRoles}
              banned={banned}
            />
          )}
          domainId={currentDomainId}
          users={paginatedContributors}
          canAdministerComments={canAdministerComments}
        />
      ) : (
        <FormattedMessage {...MSG.failedToFetch} />
      )}
      {ITEMS_PER_PAGE * dataPage < contributors.length && (
        <LoadMoreButton
          onClick={handleDataPagination}
          isLoadingData={loadingMembers}
        />
      )}
      {/* PLACEHOLDER */}
      <div>WATCHERS</div>
      {watchers?.length && (
        <MembersList<ColonyWatcher>
          colony={colony}
          domainId={currentDomainId}
          users={paginatedWatchers}
          canAdministerComments={canAdministerComments}
          extraItemContent={({ banned }) => (
            <UserPermissions roles={[]} directRoles={[]} banned={banned} />
          )}
        />
      )}
      {ITEMS_PER_PAGE * dataPage < watchers.length && (
        <LoadMoreButton
          onClick={handleDataPagination}
          isLoadingData={loadingMembers}
        />
      )}
    </div>
  );
};

Members.displayName = displayName;

export default Members as FC<Props>;
