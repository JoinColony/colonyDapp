/* @flow */

// $FlowFixMe
import React, { useMemo } from 'react';

import type { Address } from '~types';
import type { TaskMetadataMap } from '~immutable';

import { useDataFetcher, useSelector } from '~utils/hooks';
import { colonyTaskMetadataFetcher } from '../../../fetchers';
import { walletAddressSelector } from '../../../../users/selectors';

import TaskList from '../../TaskList';

type Props = {|
  colonyAddress: Address,
  filterOption: string,
  filteredDomainId: number,
|};

const displayName = 'dashboard.ColonyTasks';

const ColonyTasks = ({
  colonyAddress,
  filterOption,
  filteredDomainId,
}: Props) => {
  const walletAddress = useSelector(walletAddressSelector, []);

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

  return (
    <TaskList
      draftIds={draftIds}
      filteredDomainId={filteredDomainId}
      filterOption={filterOption}
      walletAddress={walletAddress}
    />
  );
};

ColonyTasks.displayName = displayName;

export default ColonyTasks;
