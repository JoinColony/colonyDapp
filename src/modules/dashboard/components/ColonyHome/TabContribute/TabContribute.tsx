import React, { useState, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';
import throttle from 'lodash/throttle';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID, ROOT_DOMAIN } from '~constants';
import { FullColonyFragment } from '~data/index';
import { getBalanceFromToken } from '~utils/tokens';
import { useAsyncFunction } from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { Select } from '~core/Fields';
import Button from '~core/Button';

import {
  TasksFilterOptionType,
  TasksFilterOptions,
  tasksFilterSelectOptions,
} from '../../shared/tasksFilter';

import { tokenIsETH } from '../../../../core/checks';
import ColonyInitialFunding from '../ColonyInitialFunding';
import ColonyTasks from '../ColonyTasks';

import styles from './TabContribute.css';

interface Props {
  canCreateTask: boolean;
  colony: FullColonyFragment;
  filteredDomainId: number;
  showQrCode: boolean;
}

const MSG = defineMessages({
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

const TabContribute = ({
  canCreateTask,
  colony: {
    colonyAddress,
    colonyName,
    canMintNativeToken,
    displayName,
    isInRecoveryMode,
    isNativeTokenExternal,
    nativeTokenAddress,
    tokens,
  },
  filteredDomainId,
  showQrCode,
}: Props) => {
  const history = useHistory();
  const [filterOption, setFilterOption] = useState(TasksFilterOptions.ALL_OPEN);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const formSetFilter = useCallback(
    (_: string, value: TasksFilterOptionType) => setFilterOption(value as any),
    [setFilterOption],
  );

  const transform = useCallback(
    mergePayload({
      colonyAddress,
      // Use ROOT_DOMAIN if filtered domain id equals 0
      ethDomainId: filteredDomainId || ROOT_DOMAIN,
    }),
    [colonyAddress, filteredDomainId],
  );

  const createTask = useAsyncFunction({
    error: ActionTypes.TASK_CREATE_ERROR,
    submit: ActionTypes.TASK_CREATE,
    success: ActionTypes.TASK_CREATE_SUCCESS,
    transform,
  });

  const handleCreateTask = useCallback(
    throttle(async () => {
      setIsCreatingTask(true);
      const { id } = (await createTask({})) as { id: string };
      history.replace(`/colony/${colonyName}/task/${id}`);
    }, 2000),
    [createTask],
  );

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );
  const ethToken = tokens.find(token => tokenIsETH(token));

  const nativeTokenBalance = getBalanceFromToken(
    nativeToken,
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const ethBalance = getBalanceFromToken(
    ethToken,
    COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const canMintTokens = !!(
    nativeToken &&
    !isNativeTokenExternal &&
    canMintNativeToken
  );
  const showEmptyState = !(
    nativeToken &&
    nativeTokenBalance.isZero() &&
    ethBalance.isZero()
  );

  return (
    <>
      <div className={styles.interactiveBar}>
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
          <Button
            appearance={{ theme: 'primary', size: 'medium' }}
            text={MSG.newTaskButton}
            disabled={isInRecoveryMode}
            loading={isCreatingTask}
            onClick={handleCreateTask}
          />
        )}
      </div>
      {nativeToken && nativeTokenBalance.isZero() && ethBalance.isZero() && (
        /*
         * The funding panel should be shown if the colony's balance of
         * both the native token and ETH is zero.
         */
        <ColonyInitialFunding
          canMintTokens={canMintTokens}
          colonyAddress={colonyAddress}
          displayName={displayName}
          isExternal={isNativeTokenExternal}
          showQrCode={showQrCode}
          tokenAddress={nativeToken.address}
        />
      )}
      <ColonyTasks
        canCreateTask={canCreateTask}
        colonyAddress={colonyAddress}
        onCreateTask={handleCreateTask}
        filteredDomainId={filteredDomainId}
        filterOption={filterOption}
        isCreatingTask={isCreatingTask}
        isInRecoveryMode={isInRecoveryMode}
        canMintTokens={canMintTokens}
        showEmptyState={showEmptyState}
      />
    </>
  );
};

export default TabContribute;
