import { Redirect } from 'react-router';
import React, { useState, useCallback, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
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
import { useDataFetcher, useSelector } from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import Transactions from '~admin/Transactions';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import Heading from '~core/Heading';
import Button, { ActionButton } from '~core/Button';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import LoadingTemplate from '~pages/LoadingTemplate';
// import { useLoggedInUser } from '~data/helpers';
import { colonyAddressFetcher } from '../../fetchers';
import {
  colonyNativeTokenSelector,
  colonyEthTokenSelector,
} from '../../selectors';
import { isInRecoveryMode as isInRecoveryModeCheck } from '../../checks';
import { useColonyLazyQuery } from '~data/index';

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
}

/*
 * @TODO Re-add domains once we decide what we're going to do with the
 * "Recover Colony" system
 */
// const COLONY_DB_RECOVER_BUTTON_TIMEOUT = 20 * 1000;

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
  /*
   * @TODO Re-add domains once we decide what we're going to do with the
   * "Recover Colony" system
   */
  // const [showRecoverOption, setRecoverOption] = useState(false);
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

  /*
   * @TODO Re-add domains once we decide what we're going to do with the
   * "Recover Colony" system
   */
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setRecoverOption(true);
  //   }, COLONY_DB_RECOVER_BUTTON_TIMEOUT);
  //   return () => clearTimeout(timeout);
  // });

  const formSetFilter = useCallback(
    (_: string, value: TasksFilterOptionType) => setFilterOption(value as any),
    [setFilterOption],
  );

  /*
   * @NOTE Blockchain-first approach
   * We get the colony's address from the ENS resolver, then using that,
   * we fetch data from mongo
   */
  const { data: colonyAddress, error: addressError } = useDataFetcher(
    colonyAddressFetcher,
    [colonyName],
    [colonyName],
  );

  // const { data: { colony } = {}, loading: colonyDataLoading } = useColonyQuery({
  //   variables: { address: colonyAddress },
  // });

  const [loadColony, { data }] = useColonyLazyQuery();

  useEffect(() => {
    if (colonyAddress) {
      loadColony({
        variables: { address: colonyAddress },
      });
    }
  }, [loadColony, colonyAddress]);

  /*
   * @TODO Re-add domains once they're available from mongo
   */
  // const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
  //   domainsAndRolesFetcher,
  //   [colonyAddress],
  //   [colonyAddress],
  // );

  // const { walletAddress } = useLoggedInUser();

  /*
   * @TODO Re-add domains once they're available from mongo
   */
  // const currentDomainUserRoles = useTransformer(getUserRoles, [
  //   domains,
  //   filteredDomainId || ROOT_DOMAIN,
  //   walletAddress,
  // ]);

  // const rootUserRoles = useTransformer(getUserRoles, [
  //   domains,
  //   ROOT_DOMAIN,
  //   walletAddress,
  // ]);

  // const crumbs = useMemo(() => {
  //   switch (filteredDomainId) {
  //     case 0:
  //       return [{ id: 'domain.all' }];

  //     case 1:
  //       return [{ id: 'domain.root' }];

  //     default:
  //       return domains[filteredDomainId]
  //         ? [{ id: 'domain.root' }, domains[filteredDomainId].name]
  //         : [{ id: 'domain.root' }];
  //   }
  // }, [domains, filteredDomainId]);

  const colonyArgs: [Address | undefined] = [colonyAddress || undefined];
  const nativeTokenRef = useSelector(colonyNativeTokenSelector, colonyArgs);
  const ethTokenRef = useSelector(colonyEthTokenSelector, colonyArgs);

  const transform = useCallback(
    // Use ROOT_DOMAIN if filtered domain id equals 0
    mergePayload({
      colonyAddress,
      domainId: filteredDomainId || ROOT_DOMAIN,
    }),
    [colonyAddress, filteredDomainId],
  );

  if (!colonyName || addressError) {
    return <Redirect to="/404" />;
  }

  if (
    !data ||
    !(data && data.colony) ||
    // !colony ||
    !colonyAddress
    /*
     * @TODO Re-add domains once they're available from mongo
     *
     * !domains ||
     * isFetchingDomains ||
     */
    /*
     * @TODO Re-add nativeTokenRef
     * Right now it gets hung up since the colony's data is no longer making it's way
     * into the redux state
     *
     *!nativeTokenRef ||
     */
  ) {
    return (
      <LoadingTemplate loadingText={MSG.loadingText}>
        {/*
         * @TODO Re-add domains once they're available from mongo
         */}
        {/* {showRecoverOption &&
        colonyAddress &&
        domains &&
        canRecoverColony(rootUserRoles) ? (
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
        ) : null} */}
      </LoadingTemplate>
    );
  }

  // Eventually this has to be in the proper domain. There's probably going to be a different UI for that
  /*
   * @TODO Re-add domains once they're available from mongo
   *
   * const canCreateTask = canAdminister(currentDomainUserRoles);
   */
  const canCreateTask = true;
  const isInRecoveryMode = isInRecoveryModeCheck(data.colony);

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
            colony={data.colony}
            /*
             * @TODO Re-add domains once they're available from mongo
             *
             * canAdminister={!isInRecoveryMode && canAdminister(rootUserRoles)}
             */
            canAdminister
            /*
             * @TODO Re-add domains once they're available from mongo
             *
             * domains={domains}
             */
            filteredDomainId={filteredDomainId}
            setFilteredDomainId={setFilteredDomainId}
          />
        </div>
      </aside>
      <main className={styles.content}>
        {/*
         * @TODO Re-add domains once they're available from mongo
         */}
        {/* <div className={styles.breadCrumbContainer}>
          {domains && crumbs && <BreadCrumb elements={crumbs} />}
        </div> */}
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
            {activeTab === 'tasks' ? (
              <>
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
            ) : null}
          </div>
          <TabPanel>
            <TabContribute
              allowTaskCreation={canCreateTask}
              colony={data.colony}
              filteredDomainId={filteredDomainId}
              filterOption={filterOption}
              ethTokenRef={ethTokenRef}
              nativeTokenRef={nativeTokenRef}
              /*
               * @TODO Re-add domains once they're available from mongo
               *
               * showQrCode={hasRoot(rootUserRoles)}
               */
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

export default ColonyHome;
