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

import { ColonyTokenReferenceType, DomainType } from '~immutable/index';
import { Address } from '~types/index';
import { ROOT_DOMAIN } from '../../../core/constants';
import { walletAddressSelector } from '../../../users/selectors';
import {
  TasksFilterOptionType,
  TasksFilterOptions,
  tasksFilterSelectOptions,
} from '../shared/tasksFilter';
import { ActionTypes } from '~redux/index';
import {
  useDataFetcher,
  useDataSubscriber,
  useSelector,
  useUserDomainRoles,
} from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import Heading from '~core/Heading';
import Button, { ActionButton, DialogActionButton } from '~core/Button';
import BreadCrumb from '~core/BreadCrumb';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import LoadingTemplate from '~pages/LoadingTemplate';
import {
  colonyNativeTokenSelector,
  colonyEthTokenSelector,
} from '../../selectors';
import { colonyAddressFetcher, domainsFetcher } from '../../fetchers';
import { colonySubscriber } from '../../subscribers';
import { canAdminister, isFounder } from '../../../users/checks';
import {
  isInRecoveryMode as isInRecoveryModeCheck,
  canRecoverColony,
} from '../../checks';

import ColonyFunding from './ColonyFunding';
import ColonyMeta from './ColonyMeta';
import TabContribute from './TabContribute';
import Transactions from '~admin/Transactions';
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
  intl: { formatMessage },
}: Props) => {
  const [filterOption, setFilterOption] = useState(TasksFilterOptions.ALL_OPEN);
  const [filteredDomainId, setFilteredDomainId] = useState(0);
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

  const walletAddress = useSelector(walletAddressSelector);
  const { data: roles, isFetching: isFetchingRoles } = useUserDomainRoles(
    colonyAddress || undefined,
    filteredDomainId || ROOT_DOMAIN,
    walletAddress,
  );

  const { data: domains } = useDataFetcher<DomainType[]>(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const crumbs = useMemo(() => {
    const selectedDomain =
      !!domains && domains.find(domain => domain.id === filteredDomainId);
    switch (filteredDomainId) {
      case 0:
        return [formatMessage({ id: 'domain.all' })];

      case 1:
        return [formatMessage({ id: 'domain.root' })];

      default:
        return selectedDomain
          ? [formatMessage({ id: 'domain.root' }), selectedDomain.name]
          : [formatMessage({ id: 'domain.root' })];
    }
  }, [domains, filteredDomainId, formatMessage]);

  const nativeTokenRef: ColonyTokenReferenceType | null = useSelector(
    colonyNativeTokenSelector,
    colonyArgs,
  );
  const ethTokenRef: ColonyTokenReferenceType | null = useSelector(
    colonyEthTokenSelector,
    colonyArgs,
  );

  const transform = useCallback(
    mergePayload({ colonyAddress, domainId: filteredDomainId }),
    [colonyAddress, filteredDomainId],
  );

  const canCreateTask = canAdminister(roles) || isFounder(roles);
  const isInRecoveryMode = isInRecoveryModeCheck(colony);

  if (colonyError || addressError) {
    return <Redirect to="/404" />;
  }

  if (
    !(colony && colonyAddress) ||
    isFetchingColony ||
    !roles ||
    isFetchingRoles ||
    !nativeTokenRef
  ) {
    return (
      <LoadingTemplate loadingText={MSG.loadingText}>
        {showRecoverOption && colonyAddress && canRecoverColony(roles) ? (
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
            canAdminister={!isInRecoveryMode && canAdminister(roles)}
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
              colony={colony}
              filteredDomainId={filteredDomainId}
              filterOption={filterOption}
              ethTokenRef={ethTokenRef}
              nativeTokenRef={nativeTokenRef}
              roles={roles}
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
