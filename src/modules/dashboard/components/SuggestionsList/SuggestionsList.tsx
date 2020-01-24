import React, { FC, useCallback, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Heading from '~core/Heading';
import { Select } from '~core/Fields';
import ListGroup from '~core/ListGroup';
import ListGroupItem from '~core/ListGroup/ListGroupItem';
import { SpinnerLoader } from '~core/Preloaders';
import { withDialog } from '~core/Dialog';
import { OpenDialog } from '~core/Dialog/types';
import SuggestionsListItem from '~dashboard/SuggestionsListItem';
import {
  cacheUpdates,
  useColonySuggestionsQuery,
  useLoggedInUser,
  useSetSuggestionStatusMutation,
  useCreateTaskFromSuggestionMutation,
  Domain,
  OneSuggestion,
  SuggestionStatus,
} from '~data/index';
import { Address } from '~types/index';
import { useDataFetcher } from '~utils/hooks';
import { getMainClasses } from '~utils/css';

import { domainsAndRolesFetcher } from '../../fetchers';
import {
  SuggestionsFilterOptions,
  SuggestionsFilterOptionType,
  suggestionsFilterSelectOptions,
} from '../shared/suggestionFilter';

import styles from './SuggestionsList.css';

const MSG = defineMessages({
  emptyStateTitle: {
    id: 'Dashboard.SuggestionsList.emptyStateTitle',
    defaultMessage: 'There are no suggestions here.',
  },
  emptyStateSubTitle: {
    id: 'Dashboard.SuggestionsList.emptyStateSubTitle',
    defaultMessage:
      'Create a new suggestion, or switch domains to change the filter.',
  },
  confirmCreateTaskHeading: {
    id: 'Dashboard.SuggestionsList.confirmCreateTaskHeading',
    defaultMessage: 'Accept suggestion and create a new task?',
  },
  confirmCreateTaskText: {
    id: 'Dashboard.SuggestionsList.confirmCreateTaskHeading',
    defaultMessage: `Would you like to mark this suggestion as Accepted and create a new task in your Colony?`,
  },
  confirmCreateTaskButton: {
    id: 'Dashboard.SuggestionsList.confirmCreateTaskButton',
    defaultMessage: 'Accept and Create',
  },
  confirmDeleteHeading: {
    id: 'Dashboard.SuggestionsList.confirmDeleteHeading',
    defaultMessage: 'Are you sure you would like to delete this suggestion?',
  },
  confirmDeleteText: {
    id: 'Dashboard.SuggestionsList.confirmDeleteText',
    defaultMessage: 'It is not possible to undo this action',
  },
  confirmDeleteButton: {
    id: 'Dashboard.SuggestionsList.confirmDeleteButton',
    defaultMessage: 'Yes, delete',
  },
});

interface InProps {
  colonyAddress: Address;
  colonyName: string;
  domainId: Domain['ethDomainId'];
}

interface Props extends InProps {
  // Injected via `withDialog`
  openDialog: OpenDialog;
}

const createdAtDesc = (
  { createdAt: createdAtA }: OneSuggestion,
  { createdAt: createdAtB }: OneSuggestion,
) => new Date(createdAtB).getTime() - new Date(createdAtA).getTime();

const displayName = 'Dashboard.SuggestionsList';

const SuggestionsList = ({
  colonyAddress,
  colonyName,
  domainId,
  openDialog,
}: Props) => {
  const history = useHistory();
  const { walletAddress } = useLoggedInUser();

  const [filterOption, setFilterOption] = useState<SuggestionsFilterOptionType>(
    'All',
  );

  const handleSetFilterOption = useCallback(
    (_: string, value: SuggestionsFilterOptionType) => {
      setFilterOption(value);
    },
    [setFilterOption],
  );

  const filterByDomain = useCallback(
    ({ ethDomainId }: OneSuggestion) => {
      return domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
        ? true
        : ethDomainId === domainId;
    },
    [domainId],
  );

  const filterByStatus = useCallback(
    ({ status }: OneSuggestion) => {
      return filterOption === SuggestionsFilterOptions.All
        ? true
        : status === filterOption;
    },
    [filterOption],
  );

  const { data, loading } = useColonySuggestionsQuery({
    variables: { colonyAddress },
    pollInterval: 5000,
  });

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const [setSuggestionStatus] = useSetSuggestionStatusMutation({
    update: cacheUpdates.setSuggestionStatus(colonyAddress),
  });
  const [createTaskFromSuggestion] = useCreateTaskFromSuggestionMutation();
  const handleNotPlanned = useCallback(
    (id: string) =>
      setSuggestionStatus({
        variables: { input: { id, status: SuggestionStatus.NotPlanned } },
      }),
    [setSuggestionStatus],
  );
  const handleDeleted = useCallback(
    async (id: string) => {
      await openDialog('ConfirmDialog', {
        heading: MSG.confirmDeleteHeading,
        children: MSG.confirmDeleteText,
        confirmButtonText: MSG.confirmDeleteButton,
      }).afterClosed();
      return setSuggestionStatus({
        variables: { input: { id, status: SuggestionStatus.Deleted } },
      });
    },
    [openDialog, setSuggestionStatus],
  );
  const handleCreateTask = useCallback(
    async (id: string) => {
      await openDialog('ConfirmDialog', {
        heading: MSG.confirmCreateTaskHeading,
        children: MSG.confirmCreateTaskText,
        confirmButtonText: MSG.confirmCreateTaskButton,
      }).afterClosed();
      const { data: createTaskData } = await createTaskFromSuggestion({
        update: cacheUpdates.createTaskFromSuggestion(colonyAddress, id),
        variables: { input: { id } },
      });
      if (createTaskData && createTaskData.createTaskFromSuggestion) {
        const { id: taskId } = createTaskData.createTaskFromSuggestion;
        history.push(`/colony/${colonyName}/task/${taskId}`);
      }
    },
    [colonyAddress, colonyName, createTaskFromSuggestion, history, openDialog],
  );

  const suggestions = useMemo(
    () =>
      ((data && data.colony.suggestions) || [])
        .filter(filterByDomain)
        .filter(filterByStatus)
        .sort(createdAtDesc),
    [data, filterByDomain, filterByStatus],
  );

  return loading || isFetchingDomains ? (
    <SpinnerLoader size="medium" />
  ) : (
    <>
      <div className={styles.filterContainer}>
        <Select
          connect={false}
          appearance={{ alignOptions: 'right', theme: 'alt' }}
          form={{ setFieldValue: handleSetFilterOption }}
          options={suggestionsFilterSelectOptions}
          name="suggestionsFilter"
          $value={filterOption}
        />
      </div>
      <div
        className={getMainClasses({}, styles, {
          isEmpty: suggestions.length === 0,
        })}
      >
        {suggestions.length > 0 ? (
          <ListGroup>
            {suggestions.map(suggestion => (
              <ListGroupItem
                appearance={{ padding: 'none' }}
                key={suggestion.id}
              >
                <SuggestionsListItem
                  colonyName={colonyName}
                  onNotPlanned={handleNotPlanned}
                  onDeleted={handleDeleted}
                  onCreateTask={handleCreateTask}
                  suggestion={suggestion}
                  domains={domains}
                  walletAddress={walletAddress}
                />
              </ListGroupItem>
            ))}
          </ListGroup>
        ) : (
          <div>
            <Heading
              appearance={{ size: 'medium', weight: 'bold' }}
              text={MSG.emptyStateTitle}
            />
            <Heading
              appearance={{ size: 'small' }}
              text={MSG.emptyStateSubTitle}
            />
          </div>
        )}
      </div>
    </>
  );
};

SuggestionsList.displayName = displayName;

export default (withDialog() as any)(SuggestionsList) as FC<InProps>;
