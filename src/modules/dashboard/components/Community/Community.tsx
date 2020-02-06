import React, { FC } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import { useColonySubscribedUsersQuery } from '~data/index';
import { domainsAndRolesFetcher } from '../../fetchers';
import { getCommunityRoles } from '../../../transformers';
import { useDataFetcher, useTransformer } from '~utils/hooks';
import { ROLES_COMMUNITY } from '~constants';
import { sortObjectsBy } from '~utils/arrays';

import { Table, TableBody, TableCell } from '~core/Table';
import { SpinnerLoader } from '~core/Preloaders';
import UserListItem from '~admin/UserListItem';

import styles from './Community.css';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.Community.loading',
    defaultMessage: "Loading Colony's users...",
  },
});

interface Props {
  colonyAddress: Address;
}

const Community = ({ colonyAddress }: Props) => {
  const {
    data: colonySubscribedUsers,
    loading,
  } = useColonySubscribedUsersQuery({
    variables: {
      colonyAddress,
    },
  });

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const communityRoles = useTransformer(getCommunityRoles, [domains]);

  if (!colonySubscribedUsers || loading || isFetchingDomains) {
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
      let communityRole = 'member';
      if (communityRoles.founder === userAddress) {
        communityRole = 'founder';
      }
      if (
        communityRoles.admins.find(adminAddress => adminAddress === userAddress)
      ) {
        communityRole = 'admin';
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
          if (role === 'founder') {
            return -1;
          }
          if (role === 'member') {
            return 1;
          }
          return 0;
        },
      }),
    );

  return (
    <div className={styles.main}>
      <Table scrollable>
        <TableBody className={styles.tableBody}>
          {communityUsers.map(({ id: userAddress, communityRole }) => (
            <UserListItem
              address={userAddress}
              key={userAddress}
              showDisplayName
              showMaskedAddress
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

Community.displayName = 'admin.Community';

export default Community as FC<Props>;
