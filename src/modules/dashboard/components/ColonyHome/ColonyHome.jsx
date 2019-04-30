/* @flow */

import type { Match } from 'react-router';

// $FlowFixMe update flow!
import React, { useState, useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router';

import type {
  DomainType,
  TaskMetadataMap,
  UserPermissionsType,
} from '~immutable';
import type { TasksFilterOptionType } from '../shared/tasksFilter';

import { ACTIONS } from '~redux';
import { useDataFetcher, useSelector } from '~utils/hooks';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import Button, { ActionButton } from '~core/Button';
import Heading from '~core/Heading';
import TaskList from '~dashboard/TaskList';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import LoadingTemplate from '~pages/LoadingTemplate';
import {
  TASKS_FILTER_OPTIONS,
  tasksFilterSelectOptions,
} from '../shared/tasksFilter';

import { useColonyWithName } from '../../hooks/useColony';
import { currentUserColonyPermissionsFetcher } from '../../../users/fetchers';
import { walletAddressSelector } from '../../../users/selectors';
import { domainsFetcher, colonyTaskMetadataFetcher } from '../../fetchers';
import { canAdminister, canCreateTask } from '../../../users/checks';
import { isInRecoveryMode } from '../../checks';

import ColonyMeta from './ColonyMeta';

import styles from './ColonyHome.css';

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

const getActiveDomainFilterClass = (id: number = 0, filteredDomainId: number) =>
  filteredDomainId === id ? styles.filterItemActive : styles.filterItem;

const ColonyHome = ({
  match: {
    params: { colonyName },
  },
}: Props) => {
  const [filterOption, setFilterOption] = useState(TASKS_FILTER_OPTIONS.ALL);
  const [filteredDomainId, setFilteredDomainId] = useState();

  const formSetFilter = useCallback(
    (_: string, value: TasksFilterOptionType) => setFilterOption(value),
    [setFilterOption],
  );

  const walletAddress = useSelector(walletAddressSelector, []);

  const {
    data: colony,
    isFetching: isFetchingColony,
    error: colonyError,
  } = useColonyWithName(colonyName);
  const { colonyAddress } = colony || {};

  const { data: permissions } = useDataFetcher<UserPermissionsType>(
    currentUserColonyPermissionsFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher<
    DomainType[],
  >(domainsFetcher, [colonyAddress], [colonyAddress]);

  const { data: taskMetadata } = useDataFetcher<TaskMetadataMap>(
    colonyTaskMetadataFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  // This could be simpler if we had the tuples ready to select from state
  const draftIds = useMemo(
    () =>
      Object.keys(taskMetadata || {}).map(draftId => [colonyAddress, draftId]),
    [taskMetadata, colonyAddress],
  );

  if (colonyError) {
    return <Redirect to="/404" />;
  }

  if (!colony || !domains || isFetchingColony || isFetchingDomains) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  const filterSelect = (
    <Select
      appearance={{ alignOptions: 'right', theme: 'alt' }}
      connect={false}
      elementOnly
      label={MSG.labelFilter}
      name="filter"
      options={tasksFilterSelectOptions}
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
          canAdminister={
            !isInRecoveryMode(colony) && canAdminister(permissions)
          }
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
            <TaskList
              draftIds={draftIds}
              filterOption={filterOption}
              filteredDomainId={filteredDomainId}
              walletAddress={walletAddress}
            />
          </TabPanel>
        </Tabs>
      </main>
      <aside className={styles.sidebar}>
        {canCreateTask(permissions) && (
          <ActionButton
            appearance={{ theme: 'primary', size: 'large' }}
            disabled={isInRecoveryMode(colony)}
            error={ACTIONS.TASK_CREATE_ERROR}
            submit={ACTIONS.TASK_CREATE}
            success={ACTIONS.TASK_CREATE_SUCCESS}
            text={MSG.newTaskButton}
            values={{ colonyAddress }}
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
      {isInRecoveryMode(colony) && <RecoveryModeAlert />}
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
