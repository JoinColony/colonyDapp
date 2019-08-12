/* @flow */

import type { Match } from 'react-router';

// $FlowFixMe update flow!
import React, { useState, useCallback, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router';
import { subscribeActions as subscribeToReduxActions } from 'redux-action-watch/lib/actionCreators';
import { useDispatch } from 'redux-react-hook';
import throttle from 'lodash/throttle';

import type { TokenReferenceType, UserPermissionsType } from '~immutable';
import type { Address } from '~types';
import type { TasksFilterOptionType } from '../shared/tasksFilter';

import { ACTIONS } from '~redux';
import { useDataFetcher, useDataSubscriber, useSelector } from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import Button, { ActionButton, DialogActionButton } from '~core/Button';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import LoadingTemplate from '~pages/LoadingTemplate';
import {
  TASKS_FILTER_OPTIONS,
  tasksFilterSelectOptions,
} from '../shared/tasksFilter';

import {
  colonyNativeTokenSelector,
  colonyEthTokenSelector,
} from '../../selectors';
import { currentUserColonyPermissionsFetcher } from '../../../users/fetchers';
import { colonyAddressFetcher } from '../../fetchers';
import { colonySubscriber } from '../../subscribers';
import {
  canAdminister,
  canCreateTask as canCreateTaskCheck,
} from '../../../users/checks';
import { isInRecoveryMode as isInRecoveryModeCheck } from '../../checks';

import ColonyDomains from './ColonyDomains';
import ColonyMeta from './ColonyMeta';
import TabContribute from './TabContribute';

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
  recoverColonyButton: {
    id: 'dashboard.ColonyHome.recoverColonyButton',
    defaultMessage: 'Recover Colony?',
  },
  recoverColonyHeading: {
    id: 'dashboard.ColonyHome.recoverColonyHeading',
    defaultMessage: 'Really recover this Colony?',
  },
  recoverColonyParagraph: {
    id: 'dashboard.ColonyHome.recoverColonyParagraph',
    defaultMessage: `Please ONLY do this if you know what you're doing.
    This will effectively DELETE all of your Colony's metadata
    and recreate it from scratch.`,
  },
  recoverColonyConfirmButton: {
    id: 'dashboard.ColonyHome.recoverColonyConfirmButton',
    defaultMessage: 'Yes, RECOVER this Colony',
  },
  recoverColonyCancelButton: {
    id: 'dashboard.ColonyHome.recoverColonyCancelButton',
    defaultMessage: 'Hell NO! Let me out!',
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
  const [filterOption, setFilterOption] = useState(
    TASKS_FILTER_OPTIONS.ALL_OPEN,
  );
  const [filteredDomainId, setFilteredDomainId] = useState();
  const [isTaskBeingCreated, setIsTaskBeingCreated] = useState(false);
  const [showRecoverOption, setRecoverOption] = useState(false);

  const dispatch = useDispatch();
  /*
   * @NOTE this needs to return the `subscribeToReduxActions` function, since that returns an
   * unsubscriber, and that gets called when the component is unmounted
   */
  useEffect(
    () =>
      subscribeToReduxActions(dispatch)({
        [ACTIONS.TASK_CREATE]: () => setIsTaskBeingCreated(true),
        [ACTIONS.TASK_CREATE_SUCCESS]: () => setIsTaskBeingCreated(false),
        [ACTIONS.TASK_CREATE_ERROR]: () => setIsTaskBeingCreated(false),
      }),
    [dispatch, setIsTaskBeingCreated],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRecoverOption(true);
    }, 10 * 1000);
    return () => clearTimeout(timeout);
  });

  const formSetFilter = useCallback(
    (_: string, value: TasksFilterOptionType) => setFilterOption(value),
    [setFilterOption],
  );

  const { data: colonyAddress, error: addressError } = useDataFetcher<Address>(
    colonyAddressFetcher,
    [colonyName],
    [colonyName],
  );

  const colonyArgs = [colonyAddress || undefined];
  const {
    data: colony,
    isFetching: isFetchingColony,
    error: colonyError,
  } = useDataSubscriber<*>(colonySubscriber, colonyArgs, colonyArgs);

  const {
    data: permissions,
    isFetching: isFetchingPermissions,
  } = useDataFetcher<UserPermissionsType>(
    currentUserColonyPermissionsFetcher,
    colonyArgs,
    colonyArgs,
  );

  const nativeTokenRef: ?TokenReferenceType = useSelector(
    colonyNativeTokenSelector,
    colonyArgs,
  );
  const ethTokenRef: ?TokenReferenceType = useSelector(
    colonyEthTokenSelector,
    colonyArgs,
  );

  const transform = useCallback(mergePayload({ colonyAddress }), [
    colonyAddress,
  ]);

  const canCreateTask = canCreateTaskCheck(permissions);
  const isInRecoveryMode = isInRecoveryModeCheck(colony);

  if (colonyError || addressError) {
    return <Redirect to="/404" />;
  }

  if (
    !(colony && colonyAddress) ||
    isFetchingColony ||
    !permissions ||
    isFetchingPermissions ||
    !nativeTokenRef
  ) {
    return (
      <LoadingTemplate loadingText={MSG.loadingText}>
        {showRecoverOption && colonyAddress && (
          <DialogActionButton
            dialog="ConfirmDialog"
            dialogProps={{
              appearance: { theme: 'danger' },
              heading: MSG.recoverColonyHeading,
              children: <FormattedMessage {...MSG.recoverColonyParagraph} />,
              cancelButtonText: MSG.recoverColonyCancelButton,
              confirmButtonText: MSG.recoverColonyConfirmButton,
            }}
            submit={ACTIONS.COLONY_RECOVER_DB}
            error={ACTIONS.COLONY_RECOVER_DB_ERROR}
            success={ACTIONS.COLONY_RECOVER_DB_SUCCESS}
            text={MSG.recoverColonyButton}
            values={{ colonyAddress }}
          />
        )}
      </LoadingTemplate>
    );
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
          canAdminister={!isInRecoveryMode && canAdminister(permissions)}
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
            <TabContribute
              colony={colony}
              filteredDomainId={filteredDomainId}
              filterOption={filterOption}
              ethTokenRef={ethTokenRef}
              nativeTokenRef={nativeTokenRef}
              permissions={permissions}
            />
          </TabPanel>
        </Tabs>
      </main>
      <aside className={styles.sidebar}>
        {canCreateTask && (
          <ActionButton
            button={({ onClick, disabled, loading }) => (
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                text={MSG.newTaskButton}
                disabled={disabled}
                loading={loading}
                onClick={throttle(onClick, 2000)}
              />
            )}
            disabled={isInRecoveryMode}
            error={ACTIONS.TASK_CREATE_ERROR}
            submit={ACTIONS.TASK_CREATE}
            success={ACTIONS.TASK_CREATE_SUCCESS}
            transform={transform}
            loading={isTaskBeingCreated}
          />
        )}
        <ColonyDomains
          colonyAddress={colonyAddress}
          filteredDomainId={filteredDomainId}
          setFilteredDomainId={setFilteredDomainId}
        />
      </aside>
      {isInRecoveryMode && <RecoveryModeAlert />}
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
