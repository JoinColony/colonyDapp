import { Redirect } from 'react-router';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  IntlShape,
} from 'react-intl';
import { subscribeActions as subscribeToReduxActions } from 'redux-action-watch/lib/actionCreators';
import { useDispatch } from 'redux-react-hook';
import throttle from 'lodash/throttle';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';
import { Address } from '~types/index';
import {
  TasksFilterOptionType,
  TasksFilterOptions,
  tasksFilterSelectOptions,
} from '../shared/tasksFilter';
import { ActionTypes } from '~redux/index';
import { useDataFetcher, useDataSubscriber, useSelector } from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import Transactions from '~admin/Transactions';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import Heading from '~core/Heading';
import Button, { ActionButton, DialogActionButton } from '~core/Button';
import BreadCrumb from '~core/BreadCrumb';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import LoadingTemplate from '~pages/LoadingTemplate';

import { walletAddressSelector } from '../../../users/selectors';
import { canAdminister, isFounder } from '../../../users/checks';
import { colonyAddressFetcher, domainsAndRolesFetcher } from '../../fetchers';
import {
  colonyNativeTokenSelector,
  colonyEthTokenSelector,
} from '../../selectors';
import { colonySubscriber } from '../../subscribers';
import {
  isInRecoveryMode as isInRecoveryModeCheck,
  canRecoverColony,
} from '../../checks';
import ColonyFunding from './ColonyFunding';
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
  tabTransactions: {
    id: 'dashboard.ColonyHome.tabTransactions',
    defaultMessage: 'Transactions',
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
  noFilter: {
    id: 'dashboard.ColonyHome.noFilter',
    defaultMessage: 'All Transactions in Colony',
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
  /** @ignore injected by `injectIntl` */
  intl: IntlShape;
}

const COLONY_DB_RECOVER_BUTTON_TIMEOUT = 20 * 1000;

const displayName = 'dashboard.ColonyHome';

const ColonyHome = ({
  match: {
    params: { colonyName },
  },
}: Props) => {
  const [filterOption, setFilterOption] = useState(TasksFilterOptions.ALL_OPEN);
  const [filteredDomainId, setFilteredDomainId] = useState(
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );
  const [isTaskBeingCreated, setIsTaskBeingCreated] = useState(false);
  const [showRecoverOption, setRecoverOption] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'transactions'>('tasks');

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

  const { data: colonyAddress, error: addressError } = useDataFetcher(
    colonyAddressFetcher,
    [colonyName],
    [colonyName],
  );

  const colonyArgs: [Address | undefined] = [colonyAddress || undefined];
  const {
    data: colony,
    isFetching: isFetchingColony,
    error: colonyError,
  } = useDataSubscriber(colonySubscriber, colonyArgs, colonyArgs);

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const walletAddress = useSelector(walletAddressSelector);

  const crumbs = useMemo<string[]>(
    () =>
      Object.keys(domains || {})
        .sort()
        .filter(
          id =>
            parseInt(id, 10) === ROOT_DOMAIN &&
            parseInt(id, 10) === filteredDomainId &&
            !!domains[id].name,
        )
        .map(id => domains[id].name),
    [domains, filteredDomainId],
  );

  const nativeTokenRef = useSelector(colonyNativeTokenSelector, colonyArgs);
  const ethTokenRef = useSelector(colonyEthTokenSelector, colonyArgs);

  const transform = useCallback(mergePayload({ colonyAddress }), [
    colonyAddress,
  ]);

  if (colonyError || addressError) {
    return <Redirect to="/404" />;
  }

  if (
    !(colony && colonyAddress) ||
    isFetchingColony ||
    !domains ||
    isFetchingDomains ||
    !nativeTokenRef
  ) {
    return (
      <LoadingTemplate loadingText={MSG.loadingText}>
        {showRecoverOption &&
        colonyAddress &&
        domains &&
        canRecoverColony(domains, ROOT_DOMAIN, walletAddress) ? (
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

  // Eventually this has to be in the proper domain. There's probably going to be a different UI for that
  const canCreateTask =
    canAdminister(domains, ROOT_DOMAIN, walletAddress) ||
    isFounder(domains, ROOT_DOMAIN, walletAddress);
  const isInRecoveryMode = isInRecoveryModeCheck(colony);

  const filterSelect = (
    <Select
      appearance={{ alignOptions: 'left', theme: 'alt' }}
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
              appearance={{ theme: 'primary', size: 'medium' }}
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

  const noFilter = (
    <Heading
      text={MSG.noFilter}
      appearance={{ size: 'tiny', margin: 'small' }}
    />
  );

  return (
    <div className={styles.main}>
      <aside className={styles.colonyInfo}>
        <div className={styles.metaContainer}>
          <ColonyMeta
            colony={colony}
            canAdminister={
              !isInRecoveryMode &&
              canAdminister(domains, ROOT_DOMAIN, walletAddress)
            }
            domains={domains}
            filteredDomainId={filteredDomainId}
            setFilteredDomainId={setFilteredDomainId}
          />
        </div>
      </aside>
      <main className={styles.content}>
        <div className={styles.breadCrumbContainer}>
          {domains && crumbs && <BreadCrumb elements={crumbs} />}
        </div>
        <Tabs>
          <TabList extra={activeTab === 'tasks' ? null : noFilter}>
            <Tab onClick={() => setActiveTab('tasks')}>
              <FormattedMessage {...MSG.tabContribute} />
            </Tab>
            <Tab onClick={() => setActiveTab('transactions')}>
              <FormattedMessage {...MSG.tabTransactions} />
            </Tab>
          </TabList>
          <div className={styles.interactiveBar}>
            {activeTab === 'tasks' ? [filterSelect, renderNewTaskButton] : null}
          </div>
          <TabPanel>
            <TabContribute
              allowTaskCreation={canCreateTask}
              colony={colony}
              filteredDomainId={filteredDomainId}
              filterOption={filterOption}
              ethTokenRef={ethTokenRef}
              nativeTokenRef={nativeTokenRef}
              showQrCode={isFounder(domains, ROOT_DOMAIN, walletAddress)}
            />
          </TabPanel>
          <TabPanel>
            <Transactions colonyAddress={colony.colonyAddress} />
          </TabPanel>
        </Tabs>
      </main>
      <aside className={styles.sidebar}>
        <ColonyFunding
          colonyAddress={colonyAddress}
          currentDomainId={filteredDomainId}
        />
      </aside>
      {isInRecoveryMode && <RecoveryModeAlert />}
    </div>
  );
};

ColonyHome.displayName = displayName;

export default injectIntl(ColonyHome);
