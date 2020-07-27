import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Heading from '~core/Heading';
import { Select, Form } from '~core/Fields';
import ListGroup from '~core/ListGroup';
import ListGroupItem from '~core/ListGroup/ListGroupItem';
import { SpinnerLoader } from '~core/Preloaders';
import { ConfirmDialog, useDialog } from '~core/Dialog';
import SuggestionsListItem from '~dashboard/SuggestionsListItem';
import {
  cacheUpdates,
  useColonySuggestionsQuery,
  useLoggedInUser,
  useSetSuggestionStatusMutation,
  useCreateTaskFromSuggestionMutation,
  Colony,
  Domain,
  OneSuggestion,
  SuggestionStatus,
} from '~data/index';
import { getMainClasses } from '~utils/css';

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
    id: 'Dashboard.SuggestionsList.confirmCreateTaskText',
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
  labelFilter: {
    id: 'Dashboard.SuggestionsList.labelFilter',
    defaultMessage: 'Filter',
  },
});

interface Props {
  colony: Colony;
  domainId: Domain['ethDomainId'];
}

const createdAtDesc = (
  { createdAt: createdAtA }: OneSuggestion,
  { createdAt: createdAtB }: OneSuggestion,
) => new Date(createdAtB).getTime() - new Date(createdAtA).getTime();

const displayName = 'Dashboard.SuggestionsList';

const SuggestionsList = ({
  colony,
  colony: { colonyAddress, colonyName },
  domainId,
}: Props) => {
  const history = useHistory();
  const { walletAddress } = useLoggedInUser();
  const confirm = useDialog(ConfirmDialog);

  const [filterOption, setFilterOption] = useState<SuggestionsFilterOptionType>(
    'All',
  );

  const handleSetFilterOption = useCallback(
    (value: SuggestionsFilterOptionType) => {
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
  const handleReopen = useCallback(
    (id: string) =>
      setSuggestionStatus({
        variables: { input: { id, status: SuggestionStatus.Open } },
      }),
    [setSuggestionStatus],
  );
  const handleDeleted = useCallback(
    async (id: string) => {
      await confirm({
        heading: MSG.confirmDeleteHeading,
        children: <FormattedMessage {...MSG.confirmDeleteText} />,
        confirmButtonText: MSG.confirmDeleteButton,
      }).afterClosed();
      return setSuggestionStatus({
        variables: { input: { id, status: SuggestionStatus.Deleted } },
      });
    },
    [confirm, setSuggestionStatus],
  );
  const handleCreateTask = useCallback(
    async (id: string) => {
      await confirm({
        heading: MSG.confirmCreateTaskHeading,
        children: <FormattedMessage {...MSG.confirmCreateTaskText} />,
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
    [colonyAddress, colonyName, createTaskFromSuggestion, history, confirm],
  );

  const suggestions = useMemo(
    () =>
      ((data && data.colony.suggestions) || [])
        .filter(filterByDomain)
        .filter(filterByStatus)
        .sort(createdAtDesc),
    [data, filterByDomain, filterByStatus],
  );

  return loading ? (
    <SpinnerLoader appearance={{ size: 'medium' }} />
  ) : (
    <>
      <div className={styles.filterContainer}>
        <Form initialValues={{ suggestionsFilter: 'All' }} onSubmit={() => {}}>
          <Select
            appearance={{ alignOptions: 'right', theme: 'alt' }}
            elementOnly
            label={MSG.labelFilter}
            onChange={handleSetFilterOption}
            options={suggestionsFilterSelectOptions}
            name="suggestionsFilter"
          />
        </Form>
      </div>
      <div
        className={getMainClasses({}, styles, {
          isEmpty: suggestions.length === 0,
        })}
      >
        {suggestions.length > 0 ? (
          <ListGroup>
            {suggestions.map((suggestion) => (
              <ListGroupItem
                appearance={{ padding: 'none' }}
                key={suggestion.id}
              >
                <SuggestionsListItem
                  colony={colony}
                  onNotPlanned={handleNotPlanned}
                  onDeleted={handleDeleted}
                  onCreateTask={handleCreateTask}
                  onReopen={handleReopen}
                  suggestion={suggestion}
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

export default SuggestionsList;
