import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';

import { Address, createAddress } from '~types/index';
import { DomainType } from '~immutable/index';
import Heading from '~core/Heading';
import { Select } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';
import { Table, TableBody, TableCell } from '~core/Table';
import { useDataFetcher, useRoles } from '~utils/hooks';

import UserListItem from '../UserListItem';
import { domainsFetcher } from '../../../dashboard/fetchers';

import UserPermissions from './UserPermissions';

import styles from './Permissions.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Permissions.title',
    defaultMessage: `Permissions{domainLabel, select,
      root {}
      other {: {domainLabel}} 
    }`,
  },
  labelFilter: {
    id: 'dashboard.Permissions.labelFilter',
    defaultMessage: 'Filter',
  },
});

interface Props {
  colonyAddress: Address;
}

const displayName = 'admin.Permissions';

const Permissions = ({ colonyAddress }: Props) => {
  const [selectedDomain, setSelectedDomain] = useState(1);

  const { data: domainsData, isFetching: isFetchingDomains } = useDataFetcher<
    DomainType[]
  >(domainsFetcher, [colonyAddress], [colonyAddress]);
  const domains = useMemo(
    () => [
      { value: 1, label: 'root' },
      ...(domainsData || []).map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    ],
    [domainsData],
  );

  const { data: roles, isFetching: isFetchingRoles } = useRoles(colonyAddress);

  const setFieldValue = useCallback((_, value) => setSelectedDomain(value), [
    setSelectedDomain,
  ]);

  const getPermissionsForUser = useCallback(
    (user: Address) => roles && roles[selectedDomain][user],
    [roles, selectedDomain],
  );

  const sortRootUsersFirst = useCallback(
    (userA, userB) => {
      const userAPermissions = getPermissionsForUser(userA);
      const userBPermissions = getPermissionsForUser(userB);
      if (
        (userAPermissions.ROOT && userBPermissions.ROOT) ||
        (!userAPermissions.ROOT && !userBPermissions.ROOT)
      ) {
        return 0;
      }
      return userAPermissions.ROOT ? -1 : 1;
    },
    [getPermissionsForUser],
  );

  const users = useMemo(
    () =>
      Object.keys((roles || {})[selectedDomain] || {})
        .map(createAddress)
        .sort(sortRootUsersFirst),
    [roles, selectedDomain, sortRootUsersFirst],
  );

  const domainLabel = useMemo(
    () => domains.find(({ value }) => value === selectedDomain).label,
    [domains, selectedDomain],
  );

  return (
    <div className={styles.main}>
      <main>
        <div className={styles.titleContainer}>
          <Heading
            text={MSG.title}
            textValues={{ domainLabel }}
            appearance={{ size: 'medium', theme: 'dark' }}
          />
          <Select
            appearance={{ alignOptions: 'right', theme: 'alt' }}
            connect={false}
            elementOnly
            label={MSG.labelFilter}
            name="filter"
            options={domains}
            form={{ setFieldValue }}
            $value={selectedDomain}
          />
        </div>
        <div className={styles.tableWrapper}>
          {isFetchingRoles || isFetchingDomains ? (
            <SpinnerLoader />
          ) : (
            <Table scrollable>
              <TableBody>
                {users.map(user => (
                  <UserListItem
                    address={user}
                    key={user}
                    showDisplayName
                    showMaskedAddress
                    showUsername
                  >
                    <TableCell>
                      <UserPermissions
                        colonyAddress={colonyAddress}
                        domainId={selectedDomain}
                        userAddress={user}
                      />
                    </TableCell>
                  </UserListItem>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
      <aside className={styles.sidebar}>
        <ul>
          <li>
            <p>Placeholder for sidebar</p>
          </li>
        </ul>
      </aside>
    </div>
  );
};

Permissions.displayName = displayName;

export default Permissions;
