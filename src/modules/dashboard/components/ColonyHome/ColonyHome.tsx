import { Redirect } from 'react-router';
import React, { useState, useCallback, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { subscribeActions as subscribeToReduxActions } from 'redux-action-watch/lib/actionCreators';
import { useDispatch } from 'redux-react-hook';
import throttle from 'lodash/throttle';

import {
  TokenReferenceType,
  UserPermissionsType,
  DomainType,
} from '~immutable/index';
import { Address } from '~types/index';
import {
  TasksFilterOptionType,
  TasksFilterOptions,
  tasksFilterSelectOptions,
} from '../shared/tasksFilter';
import { ActionTypes } from '~redux/index';
import { useDataFetcher, useDataSubscriber, useSelector } from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import Button, { ActionButton, DialogActionButton } from '~core/Button';
import BreadCrumb from '~core/BreadCrumb';
import Heading from '~core/Heading';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import LoadingTemplate from '~pages/LoadingTemplate';
import {
  colonyNativeTokenSelector,
  colonyEthTokenSelector,
} from '../../selectors';
import { currentUserColonyPermissionsFetcher } from '../../../users/fetchers';
import { colonyAddressFetcher, domainsFetcher } from '../../fetchers';
import { colonySubscriber } from '../../subscribers';
import {
  canAdminister,
  canCreateTask as canCreateTaskCheck,
} from '../../../users/checks';
import {
  isInRecoveryMode as isInRecoveryModeCheck,
  canRecoverColony,
} from '../../checks';

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
    defaultMessage: 'Tasks',
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
  availableFunds: {
    id: 'dashboard.ColonyHome.availableFunds',
    defaultMessage: 'Available Funds',
  },
  fund: {
    id: 'dashboard.ColonyHome.fund',
    defaultMessage: 'Fund',
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
    and recreate it from scratch. After that, the page will be reloaded!`,
  },
  recoverColonyConfirmButton: {
    id: 'dashboard.ColonyHome.recoverColonyConfirmButton',
    defaultMessage: 'Yes, RECOVER this Colony',
  },
  recoverColonyCancelButton: {
    id: 'dashboard.ColonyHome.recoverColonyCancelButton',
    defaultMessage: 'Nope! Take me back, please',
  },
});

interface Props {
  match: any;
}

const COLONY_DB_RECOVER_BUTTON_TIMEOUT = 20 * 1000;

const displayName = 'dashboard.ColonyHome';

const ColonyHome = ({
  match: {
    params: { colonyName },
  },
}: Props) => {
  const [filterOption, setFilterOption] = useState(TasksFilterOptions.ALL_OPEN);
  const [filteredDomainId, setFilteredDomainId] = useState(0);
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
        [ActionTypes.TASK_CREATE]: () => setIsTaskBeingCreated(true),
        [ActionTypes.TASK_CREATE_SUCCESS]: () => setIsTaskBeingCreated(false),
        [ActionTypes.TASK_CREATE_ERROR]: () => setIsTaskBeingCreated(false),
      }),
    [dispatch, setIsTaskBeingCreated],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRecoverOption(true);
    }, COLONY_DB_RECOVER_BUTTON_TIMEOUT);
    return () => clearTimeout(timeout);
  });

  const formSetFilter = useCallback(
    (_: string, value: TasksFilterOptionType) => setFilterOption(value as any),
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
  } = useDataSubscriber<any>(colonySubscriber, colonyArgs, colonyArgs);

  const {
    data: permissions,
    isFetching: isFetchingPermissions,
  } = useDataFetcher<UserPermissionsType>(
    currentUserColonyPermissionsFetcher,
    colonyArgs,
    colonyArgs,
  );

  const { data: domains } = useDataFetcher<DomainType[]>(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const nativeTokenRef: TokenReferenceType | null = useSelector(
    colonyNativeTokenSelector,
    colonyArgs,
  );
  const ethTokenRef: ColonyTokenReferenceType | null = useSelector(
    colonyEthTokenSelector,
    colonyArgs,
  );

  const transform = useCallback(mergePayload({ colonyAddress }), [
    colonyAddress,
  ]);

  const canCreateTask = canCreateTaskCheck(permissions as UserPermissionsType);
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
        {showRecoverOption &&
        colonyAddress &&
        canRecoverColony(permissions as UserPermissionsType) ? (
          <DialogActionButton
            dialog="ConfirmDialog"
            dialogProps={{
              appearance: { theme: 'danger' },
              heading: MSG.recoverColonyHeading,
              children: <FormattedMessage {...MSG.recoverColonyParagraph} />,
              cancelButtonText: MSG.recoverColonyCancelButton,
              confirmButtonText: MSG.recoverColonyConfirmButton,
            }}
            submit={ActionTypes.COLONY_RECOVER_DB}
            error={ActionTypes.COLONY_RECOVER_DB_ERROR}
            success={ActionTypes.COLONY_RECOVER_DB_SUCCESS}
            text={MSG.recoverColonyButton}
            values={{ colonyAddress }}
          />
        ) : null}
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

  const renderNewTaskButton = (
    <>
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
          error={ActionTypes.TASK_CREATE_ERROR}
          submit={ActionTypes.TASK_CREATE}
          success={ActionTypes.TASK_CREATE_SUCCESS}
          transform={transform}
          loading={isTaskBeingCreated}
        />
      )}
    </>
  );

  const crumbs = (domains || [])
    .sort((a, b) => a.id - b.id)
    .reduce(
      (accumulator, element) => {
        if (element.id <= filteredDomainId) {
          accumulator.push(element.name);
        }
        return accumulator;
      },
      ['Root'],
    );

  return (
    <div className={styles.main}>
      <aside className={styles.colonyInfo}>
        <div className={styles.metaContainer}>
          <ColonyMeta
            colony={colony}
            canAdminister={!isInRecoveryMode && canAdminister(permissions)}
          />
        </div>
        <div className={styles.domainContainer}>
          <ColonyDomains
            noTitle
            colonyAddress={colonyAddress}
            filteredDomainId={filteredDomainId}
            setFilteredDomainId={setFilteredDomainId}
          />
        </div>
      </aside>
      <main className={styles.content}>
        <div className={styles.breadCrumbContainer}>
          <BreadCrumb elements={crumbs} />
        </div>
        <Tabs>
          <TabList>
            <Tab>
              <FormattedMessage {...MSG.tabContribute} />
            </Tab>
          </TabList>
          <div className={styles.interactiveBar}>
            {filterSelect} {renderNewTaskButton}
          </div>
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
        <Heading appearance={{ size: 'normal' }} text={MSG.availableFunds} />
        <Button text={MSG.fund} appearance={{ theme: 'blue' }} />
      </aside>
      {isInRecoveryMode && <RecoveryModeAlert />}
    </div>
  );
};

ColonyHome.displayName = displayName;

export default ColonyHome;
