import React, { useCallback, useMemo, useState } from 'react';

import {
  defineMessages,
  injectIntl,
  IntlShape,
  FormattedMessage,
} from 'react-intl';
import { compose } from 'recompose';

import { ROOT_DOMAIN } from '~constants';
import { Address, ColonyRoles } from '~types/index';
import { DomainType } from '~immutable/index';
import Heading from '~core/Heading';
import { Select } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';
import { Table, TableBody, TableCell } from '~core/Table';
import Button from '~core/Button';
import withDialog from '~core/Dialog/withDialog';
import { DialogType } from '~core/Dialog';
import ExternalLink from '~core/ExternalLink';
import { useDataFetcher, useSelector } from '~utils/hooks';

import { domainsFetcher } from '../../../dashboard/fetchers';
import { domainSelector } from '../../../dashboard/selectors';
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
  intl: IntlShape;
  openDialog: (
    dialogName: string,
    dialogProps?: Record<string, any>,
  ) => DialogType;
}

const displayName = 'admin.Permissions';

const Permissions = ({ colonyAddress, openDialog }: Props) => {
  const [selectedDomainId, setSelectedDomainId] = useState<string>(ROOT_DOMAIN);

  const {
    data: domainsObj = {},
    isFetching: isFetchingDomains,
  } = useDataFetcher(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress, { fetchRoles: true }],
  );

  const domains = useMemo<{ label: string; value: number }[]>(
    () =>
      (Object.values(domainsObj) as DomainType[])
        .map(({ id, name }) => ({ value: parseInt(id, 10), label: name }))
        .sort((a, b) => a.value - b.value),
    [domainsObj],
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

  const selectedDomain = useSelector(domainSelector, [
    colonyAddress,
    selectedDomainId,
  ]);

  // Sort the users for the selected role such that those with root are first
  const userAddresses = useMemo<Address[]>(
    () =>
      selectedDomain
        ? Object.keys(selectedDomain.roles).sort((a, b) => {
            const rootA = selectedDomain.roles[a].has(ColonyRoles.ROOT);
            const rootB = selectedDomain.roles[b].has(ColonyRoles.ROOT);
            if ((rootA && rootB) || (!rootA && !rootB)) {
              return 0;
            }
            return rootA ? -1 : 1;
          })
        : [],
    [selectedDomain],
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
          <Select
            appearance={{ alignOptions: 'right', theme: 'alt' }}
            connect={false}
            elementOnly
            label={MSG.labelFilter}
            name="filter"
            options={domains}
            form={{ setFieldValue }}
            $value={selectedDomainId}
          />
        </div>
        <div className={styles.tableWrapper}>
          {isFetchingDomains ? (
            <SpinnerLoader />
          ) : (
            <>
              <Table scrollable>
                <TableBody className={styles.tableBody}>
                  {userAddresses.map(userAddress => (
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
                          colonyAddress={colonyAddress}
                          domainId={selectedDomainId}
                          userAddress={userAddress}
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
          )}
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
