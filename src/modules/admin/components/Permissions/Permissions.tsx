import React, { useCallback, useMemo, useState } from 'react';

import {
  defineMessages,
  injectIntl,
  IntlShape,
  FormattedMessage,
} from 'react-intl';
import { compose } from 'recompose';
import sortBy from 'lodash/sortby';

import { ROLES, ROOT_DOMAIN } from '~constants';
import { Address, DomainsMapType } from '~types/index';
import { DomainType } from '~immutable/index';
import Heading from '~core/Heading';
import { Select } from '~core/Fields';
import { Table, TableBody, TableCell } from '~core/Table';
import Button from '~core/Button';
import withDialog from '~core/Dialog/withDialog';
import { DialogType } from '~core/Dialog';
import ExternalLink from '~core/ExternalLink';
import { useTransformer } from '~utils/hooks';

import { getDomainRoles } from '../../../transformers';
import UserListItem from '../UserListItem';
import UserPermissions from './UserPermissions';

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
  intl: IntlShape;
  openDialog: (
    dialogName: string,
    dialogProps?: Record<string, any>,
  ) => DialogType;
}

const displayName = 'admin.Permissions';

const Permissions = ({ colonyAddress, domains, openDialog }: Props) => {
  const [selectedDomainId, setSelectedDomainId] = useState(ROOT_DOMAIN);

  const domainRoles = useTransformer(getDomainRoles, [
    domains,
    selectedDomainId,
  ]);

  const domainSelectOptions = sortBy(
    (Object.values(domains) as DomainType[]).map(({ id, name }) => ({
      value: id,
      label: name,
    })),
    ['value'],
  );

  const setFieldValue = useCallback((_, value) => setSelectedDomainId(value), [
    setSelectedDomainId,
  ]);

  const handleEditPermissions = useCallback(
    (userAddress?: Address) =>
      openDialog('ColonyPermissionEditDialog', {
        colonyAddress,
        domainId: selectedDomainId,
        clickedUser: userAddress || null,
      }),
    [openDialog, colonyAddress, selectedDomainId],
  );

  // Convert to array and sort the users for the selected role such that those with root are first
  const domainRolesArray = useMemo(
    () =>
      Object.entries(domainRoles)
        .sort(([, roles]) => (roles.includes(ROLES.ROOT) ? -1 : 1))
        .map(([userAddress, roles]) => ({ userAddress, roles })),
    [domainRoles],
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
            appearance={{ alignOptions: 'right', theme: 'alt' }}
            connect={false}
            elementOnly
            label={MSG.labelFilter}
            name="filter"
            options={domainSelectOptions}
            form={{ setFieldValue }}
            $value={selectedDomainId}
          />
        </div>
        <div className={styles.tableWrapper}>
          <>
            <Table scrollable>
              <TableBody className={styles.tableBody}>
                {domainRolesArray.map(({ userAddress }) => (
                  <UserListItem
                    address={userAddress}
                    key={userAddress}
                    onClick={handleEditPermissions}
                    showDisplayName
                    showMaskedAddress
                    showUsername
                  >
                    <TableCell>
                      <UserPermissions
                        userAddress={userAddress}
                        domains={domains}
                        domainId={selectedDomainId}
                      />
                    </TableCell>
                  </UserListItem>
                ))}
              </TableBody>
            </Table>
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
          </>
        </div>
      </main>
      <aside className={styles.sidebar}>
        <ul>
          <li>
            <Button
              appearance={{ theme: 'blue' }}
              text={MSG.addRole}
              onClick={handleEditPermissions}
            />
          </li>
        </ul>
      </aside>
    </div>
  );
};

Permissions.displayName = displayName;

const enhance = compose(
  withDialog(),
  injectIntl,
) as any;

export default enhance(Permissions);
