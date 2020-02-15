import React, { useCallback, useMemo, useState } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';
import sortBy from 'lodash/sortBy';

import { ROLES, ROOT_DOMAIN } from '~constants';
import { Address, DomainsMapType } from '~types/index';
import { DomainType } from '~immutable/index';
import Heading from '~core/Heading';
import { Select } from '~core/Fields';
import { Table, TableBody, TableCell } from '~core/Table';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import ExternalLink from '~core/ExternalLink';
import { useTransformer } from '~utils/hooks';

import { getDomainRoles } from '../../../transformers';
import UserListItem from '../UserListItem';
import UserPermissions from './UserPermissions';
import ColonyPermissionsAddDialog from './ColonyPermissionsAddDialog';
import ColonyPermissionsEditDialog from './ColonyPermissionsEditDialog';

import styles from './Permissions.css';

const DOMAINS_HELP_URL = 'https://help.colony.io/';

const MSG = defineMessages({
  title: {
    id: 'admin.Permissions.title',
    defaultMessage: `Permissions{domainLabel, select,
      root {}
      other {: {domainLabel}}
    }`,
  },
  labelFilter: {
    id: 'admin.Permissions.labelFilter',
    defaultMessage: 'Filter',
  },
  addRole: {
    id: 'admin.Permissions.addRole',
    defaultMessage: 'Add Role',
  },
  permissionInParent: {
    id: 'admin.Permissions.permissionInParent',
    defaultMessage: '*Permission granted via parent domain. {learnMore}',
  },
  learnMore: {
    id: 'admin.Permissions.learnMore',
    defaultMessage: 'Learn more',
  },
});

interface Props {
  colonyAddress: Address;
  domains: DomainsMapType;
}

const displayName = 'admin.Permissions';

const Permissions = ({ colonyAddress, domains }: Props) => {
  const [selectedDomainId, setSelectedDomainId] = useState<number>(ROOT_DOMAIN);

  const openPermissionsAddDialog = useDialog(ColonyPermissionsAddDialog);
  const openPermissionsEditDialog = useDialog(ColonyPermissionsEditDialog);

  const domainRoles = useTransformer(getDomainRoles, [
    domains,
    selectedDomainId,
  ]);

  const directDomainRoles = useTransformer(getDomainRoles, [
    domains,
    Number(selectedDomainId),
    true,
  ]);

  const domainSelectOptions = sortBy(
    (Object.values(domains) as DomainType[]).map(({ id, name }) => ({
      value: id.toString(),
      label: name,
    })),
    ['value'],
  );

  const setFieldValue = useCallback(
    (_, value) => setSelectedDomainId(parseInt(value, 10)),
    [setSelectedDomainId],
  );

  const handleAddPermissions = useCallback(() => {
    openPermissionsAddDialog({
      colonyAddress,
      domainId: selectedDomainId,
    });
  }, [openPermissionsAddDialog, colonyAddress, selectedDomainId]);

  const handleEditPermissions = useCallback(
    (userAddress: Address) =>
      openPermissionsEditDialog({
        colonyAddress,
        domainId: selectedDomainId,
        userAddress,
      }),
    [openPermissionsEditDialog, colonyAddress, selectedDomainId],
  );

  const domainRolesArray = useMemo(
    () =>
      Object.entries(domainRoles)
        .sort(([, roles]) => (roles.includes(ROLES.ROOT) ? -1 : 1))
        .filter(([, roles]) => !!roles.length)
        .map(([userAddress, roles]) => ({
          userAddress,
          roles,
          directRoles: directDomainRoles[userAddress] || [],
        })),
    [directDomainRoles, domainRoles],
  );

  const selectedDomain = domains[selectedDomainId];

  return (
    <div className={styles.main}>
      <main>
        <div className={styles.titleContainer}>
          <Heading
            text={MSG.title}
            textValues={{
              domainLabel: selectedDomain ? selectedDomain.name : undefined,
            }}
            appearance={{ size: 'medium', theme: 'dark' }}
          />
          <Select
            appearance={{
              alignOptions: 'right',
              theme: 'alt',
              width: 'strict',
            }}
            connect={false}
            elementOnly
            label={MSG.labelFilter}
            name="filter"
            options={domainSelectOptions}
            form={{ setFieldValue }}
            $value={selectedDomainId.toString()}
          />
        </div>
        <div className={styles.tableWrapper}>
          <>
            <Table scrollable>
              <TableBody className={styles.tableBody}>
                {domainRolesArray.map(({ userAddress, roles, directRoles }) => (
                  <UserListItem
                    address={userAddress}
                    key={userAddress}
                    onClick={handleEditPermissions}
                    showDisplayName
                    showMaskedAddress
                    showUsername
                    showInfo={false}
                  >
                    <TableCell>
                      <UserPermissions
                        roles={roles}
                        directRoles={directRoles}
                      />
                    </TableCell>
                  </UserListItem>
                ))}
              </TableBody>
            </Table>
            {selectedDomain && selectedDomain.id !== ROOT_DOMAIN && (
              <p className={styles.parentPermissionTip}>
                <FormattedMessage
                  {...MSG.permissionInParent}
                  values={{
                    learnMore: (
                      <ExternalLink
                        text={MSG.learnMore}
                        href={DOMAINS_HELP_URL}
                      />
                    ),
                  }}
                />
              </p>
            )}
          </>
        </div>
      </main>
      <aside className={styles.sidebar}>
        <ul>
          <li>
            <Button
              appearance={{ theme: 'blue' }}
              text={MSG.addRole}
              onClick={handleAddPermissions}
            />
          </li>
        </ul>
      </aside>
    </div>
  );
};

Permissions.displayName = displayName;

export default Permissions;
