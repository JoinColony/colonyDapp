/* @flow */

import React from 'react';

import type { TaskProps, TokenReferenceType, UserType } from '~immutable';

import Assignment from '~core/Assignment';
import { SpinnerLoader } from '~core/Preloaders';
import { useDataFetcher } from '~utils/hooks';

import { colonyNativeTokenFetcher } from '../../fetchers';
import { userFetcher } from '../../../users/fetchers';

type Props = TaskProps<{
  colonyAddress: *,
  draftId: *,
  payouts: *,
  reputation: *,
  workerAddress: *,
}>;

const displayName = 'dashboard.TaskAssignment';

const TaskAssignment = ({
  colonyAddress,
  payouts,
  reputation,
  workerAddress,
}: Props) => {
  /*
   * Using a data fetcher here incase task is accessed directly without
   * first loading the colony.
   */
  const {
    data: nativeToken,
    isFetching: isFetchingNativeToken,
  } = useDataFetcher<TokenReferenceType>(
    colonyNativeTokenFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const { data: worker } = useDataFetcher<UserType>(
    userFetcher,
    [workerAddress],
    [workerAddress],
  );

  if (isFetchingNativeToken) return <SpinnerLoader />;
  return !nativeToken ? null : (
    <Assignment
      nativeToken={nativeToken}
      payouts={payouts}
      reputation={reputation}
      worker={worker}
    />
  );
};

TaskAssignment.displayName = displayName;

export default TaskAssignment;
