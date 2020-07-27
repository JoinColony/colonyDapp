import React, { useState, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';
import throttle from 'lodash/throttle';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { Colony } from '~data/index';
import { getBalanceFromToken } from '~utils/tokens';
import { useAsyncFunction } from '~utils/hooks';
import { mergePayload } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { Select, Form } from '~core/Fields';
import Button from '~core/Button';

import {
  TasksFilterOptions,
  tasksFilterSelectOptions,
} from '../../shared/tasksFilter';

import { tokenIsETH } from '../../../../core/checks';
import ColonyInitialFunding from '../ColonyInitialFunding';
import ColonyTasks from '../ColonyTasks';

import styles from './TabContribute.css';

interface Props {
  canCreateTask: boolean;
  colony: Colony;
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
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [tasksFilter, setTasksFilter] = useState<string>(
    TasksFilterOptions.ALL_OPEN,
  );

  const transform = useCallback(
    mergePayload({
      colonyAddress,
      // Use ROOT_DOMAIN if filtered domain id equals 0
      ethDomainId: filteredDomainId || ROOT_DOMAIN_ID,
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
      history.push(`/colony/${colonyName}/task/${id}`);
    }, 2000),
    [createTask],
  );

  const nativeToken = tokens.find(
    ({ address }) => address === nativeTokenAddress,
  );
  const ethToken = tokens.find((token) => tokenIsETH(token));

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
      <Form
        initialValues={{ filter: TasksFilterOptions.ALL_OPEN }}
        onSubmit={() => {}}
      >
        <div className={styles.interactiveBar}>
          <Select
            appearance={{ alignOptions: 'left', theme: 'alt' }}
            elementOnly
            label={MSG.labelFilter}
            name="filter"
            options={tasksFilterSelectOptions}
            onChange={setTasksFilter}
            placeholder={MSG.placeholderFilter}
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
      </Form>

      {/* eslint-disable-next-line max-len */}
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
        filterOption={tasksFilter}
        isCreatingTask={isCreatingTask}
        isInRecoveryMode={isInRecoveryMode}
        canMintTokens={canMintTokens}
        showEmptyState={showEmptyState}
      />
    </>
  );
};

export default TabContribute;
