/* @flow */

import type { Match } from 'react-router';

// $FlowFixMe update flow!
import React, { Fragment, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router';

import type { ColonyType, DomainType, UserPermissionsType } from '~immutable';

import { ACTIONS } from '~redux';
import { useDataFetcher, useFeatureFlags, useReduxState } from '~utils/hooks';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import Button, { ActionButton } from '~core/Button';
import Heading from '~core/Heading';
import ColonyGrid from '~dashboard/ColonyGrid';
import TaskList from '~dashboard/TaskList';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import LoadingTemplate from '~pages/LoadingTemplate';

import { currentUserColonyPermissionsFetcher } from '../../../users/fetchers';
import { colonyFetcher, domainsFetcher } from '../../fetchers';
import {
  canCreateTask,
  currentUserAddressSelector,
} from '../../../users/selectors';
import { isInRecoveryMode } from '../../selectors';

import ColonyMeta from './ColonyMeta';

import styles from './ColonyHome.css';

import mockTasks from '../../../../__mocks__/mockTasks';
import mockColonies from '../../../../__mocks__/mockColonies';

const MSG = defineMessages({
  loadingText: {
    id: 'dashboard.Admin.loadingText',
    defaultMessage: 'Loading Colony',
  },
  tabContribute: {
    id: 'dashboard.ColonyHome.tabContribute',
    defaultMessage: 'Contribute',
  },
  labelFilter: {
    id: 'dashboard.ColonyHome.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.ColonyHome.placeholderFilter',
    defaultMessage: 'Filter',
  },
  filterOptionAll: {
    id: 'dashboard.ColonyHome.filterOptionAll',
    defaultMessage: 'All open tasks',
  },
  filterOptionCreated: {
    id: 'dashboard.ColonyHome.filterOptionCreated',
    defaultMessage: 'Created by you',
  },
  filterOptionAssigned: {
    id: 'dashboard.ColonyHome.filterOptionAssigned',
    defaultMessage: 'Assigned to you',
  },
  filterOptionCompleted: {
    id: 'dashboard.ColonyHome.filterOptionCompleted',
    defaultMessage: 'Completed',
  },
  emptyText: {
    id: 'dashboard.ColonyHome.emptyText',
    defaultMessage: `It looks like you have not worked on any colonies.
Why don't you check out one of these colonies for tasks that you can complete:`,
  },
  newTaskButton: {
    id: 'dashboard.ColonyHome.newTaskButton',
    defaultMessage: 'New Task',
  },
  sidebarDomainsTitle: {
    id: 'dashboard.ColonyHome.sidebarDomainsTitle',
    defaultMessage: 'Domains',
  },
  allDomains: {
    id: 'dashboard.ColonyHome.allDomains',
    defaultMessage: 'All',
  },
});

type Props = {|
  match: Match,
|};

const displayName = 'dashboard.ColonyHome';

const filterOptions = [
  { label: MSG.filterOptionAll, value: 'all' },
  { label: MSG.filterOptionCreated, value: 'created' },
  { label: MSG.filterOptionAssigned, value: 'assigned' },
  { label: MSG.filterOptionCompleted, value: 'completed' },
];

const getActiveDomainFilterClass = (id: number = 0, filteredDomainId: number) =>
  filteredDomainId === id ? styles.filterItemActive : styles.filterItem;

const ColonyHome = ({
  match: {
    params: { ensName },
  },
}: Props) => {
  const { given } = useFeatureFlags();
  const [filterOption, setFilterOption] = useState('all');
  /*
   * TODO Replace with actual filtering logic
   */
  const [filteredDomainId, setFilteredDomainId] = useState(0);

  const {
    data: colony,
    isFetching: isFetchingColony,
    error: colonyError,
  } = useDataFetcher<ColonyType>(colonyFetcher, [ensName], [ensName]);
  const {
    data: permissions,
    isFetching: isFetchingPermissions,
  } = useDataFetcher<UserPermissionsType>(
    currentUserColonyPermissionsFetcher,
    [ensName],
    [ensName],
  );
  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher<
    DomainType[],
  >(domainsFetcher, [ensName], [ensName]);

  const walletAddress = useReduxState(currentUserAddressSelector);

  if (!ensName || colonyError) {
    return <Redirect to="/404" />;
  }

  if (!colony || !domains || isFetchingColony || isFetchingDomains) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  /*
   * @NOTE Also change this when working on the Dashboard tasks
   *
   * This is exactly the same as the task list from the dashboard, so it will be
   * wise to also work on this when implementing the real filtering login / tasks
   */
  const formSetFilter = (
    _: string,
    value: 'all' | 'created' | 'assigned' | 'completed',
  ) => setFilterOption(value);

  /*
   * Tasks and colonies will most likely end up being passed in via props
   */
  const tasks = mockTasks;
  const colonies = mockColonies;
  const filterSelect = (
    <Select
      appearance={{ alignOptions: 'right', theme: 'alt' }}
      connect={false}
      elementOnly
      label={MSG.labelFilter}
      name="filter"
      options={filterOptions}
      placeholder={MSG.placeholderFilter}
      form={{ setFieldValue: formSetFilter }}
      $value={filterOption}
    />
  );
  return (
    <div className={styles.main}>
      <aside className={styles.colonyInfo}>
        <ColonyMeta
          colony={colony}
          /*
           * TODO This needs real logic to determine if the user is an admin
           */
          canAdminister={!!walletAddress && !colony.inRecoveryMode}
        />
      </aside>
      <main className={styles.content}>
        <Tabs>
          <TabList extra={filterSelect}>
            <Tab>
              <FormattedMessage {...MSG.tabContribute} />
            </Tab>
          </TabList>
          <TabPanel>
            {tasks && tasks.length ? (
              <TaskList tasks={tasks} />
            ) : (
              <Fragment>
                <p className={styles.noTasks}>
                  <FormattedMessage {...MSG.emptyText} />
                </p>
                <ColonyGrid colonies={colonies} />
              </Fragment>
            )}
          </TabPanel>
        </Tabs>
      </main>
      <aside className={styles.sidebar}>
        {given(permissions, canCreateTask) && (
          <ActionButton
            appearance={{ theme: 'primary', size: 'large' }}
            error={ACTIONS.TASK_CREATE_ERROR}
            loading={isFetchingPermissions}
            submit={ACTIONS.TASK_CREATE}
            success={ACTIONS.TASK_CREATE_SUCCESS}
            text={MSG.newTaskButton}
            values={{ colonyENSName: ensName }}
            disabled={given(colony, isInRecoveryMode)}
          />
        )}
        <ul className={styles.domainsFilters}>
          <Heading
            appearance={{ size: 'normal', weight: 'bold' }}
            text={MSG.sidebarDomainsTitle}
          />
          <li>
            <Button
              className={getActiveDomainFilterClass(0, filteredDomainId)}
              onClick={() => setFilteredDomainId()}
            >
              <FormattedMessage {...MSG.allDomains} />
            </Button>
          </li>
          {domains.map(({ name, id }) => (
            <li key={`domain_${id}`}>
              <Button
                className={getActiveDomainFilterClass(id, filteredDomainId)}
                onClick={() => setFilteredDomainId(id)}
              >
                #{name}
              </Button>
            </li>
          ))}
        </ul>
      </aside>
      {given(colony, isInRecoveryMode) && <RecoveryModeAlert />}
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
