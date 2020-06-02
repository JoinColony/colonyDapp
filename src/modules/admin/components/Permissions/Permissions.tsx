import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import sortBy from 'lodash/sortBy';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';

import { Address } from '~types/index';
import Heading from '~core/Heading';
import { Select, Form } from '~core/Fields';
import { Table, TableBody, TableCell } from '~core/Table';
import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import ExternalLink from '~core/ExternalLink';
import { useTransformer } from '~utils/hooks';
import { Colony } from '~data/index';

import { getAllUserRolesForDomain } from '../../../transformers';
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
  colony: Colony;
}

const displayName = 'admin.Permissions';

const Permissions = ({ colony: { colonyAddress, domains }, colony }: Props) => {
  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    ROOT_DOMAIN_ID,
  );

  const openPermissionsAddDialog = useDialog(ColonyPermissionsAddDialog);
  const openPermissionsEditDialog = useDialog(ColonyPermissionsEditDialog);

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
    domains.map(({ id, name }) => ({
      value: id.toString(),
      label: name,
    })),
    ['value'],
  );

  const setFieldValue = useCallback(
    (value) => setSelectedDomainId(parseInt(value, 10)),
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
      domainRoles
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
        }),
    [directDomainRoles, domainRoles],
  );

  const selectedDomain = domains.find(
    ({ ethDomainId }) => ethDomainId === selectedDomainId,
  );

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
          <Form
            initialValues={{ filter: ROOT_DOMAIN.toString() }}
            onSubmit={() => {}}
          >
            <Select
              appearance={{
                alignOptions: 'right',
                theme: 'alt',
                width: 'strict',
              }}
              elementOnly
              label={MSG.labelFilter}
              name="filter"
              onChange={setFieldValue}
              options={domainSelectOptions}
            />
          </Form>
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
            {!(selectedDomainId === ROOT_DOMAIN_ID) && (
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
