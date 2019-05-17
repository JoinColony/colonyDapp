/* @flow */

import type { Match } from 'react-router';

// $FlowFixMe update flow!
import React, { useState, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router';

import type { UserPermissionsType } from '~immutable';
import type { TasksFilterOptionType } from '../shared/tasksFilter';

import { ACTIONS } from '~redux';
import { useDataFetcher } from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import { ActionButton } from '~core/Button';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import LoadingTemplate from '~pages/LoadingTemplate';
import {
  TASKS_FILTER_OPTIONS,
  tasksFilterSelectOptions,
} from '../shared/tasksFilter';

import { useColonyWithName } from '../../hooks/useColony';
import { currentUserColonyPermissionsFetcher } from '../../../users/fetchers';
import { canAdminister, canCreateTask } from '../../../users/checks';
import { isInRecoveryMode } from '../../checks';

import ColonyDomains from './ColonyDomains';
import ColonyMeta from './ColonyMeta';
import ColonyTasks from './ColonyTasks';

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
});

type Props = {|
  match: Match,
|};

const displayName = 'dashboard.ColonyHome';

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

  const transform = useCallback(mergePayload({ colonyAddress }), [
    colonyAddress,
  ]);

  if (colonyError) {
    return <Redirect to="/404" />;
  }

  if (!colony || isFetchingColony) {
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
            <ColonyTasks
              colonyAddress={colonyAddress}
              filteredDomainId={filteredDomainId}
              filterOption={filterOption}
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
            transform={transform}
          />
        )}
        <ColonyDomains
          colonyAddress={colonyAddress}
          filteredDomainId={filteredDomainId}
          setFilteredDomainId={setFilteredDomainId}
        />
      </aside>
      {isInRecoveryMode(colony) && <RecoveryModeAlert />}
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
