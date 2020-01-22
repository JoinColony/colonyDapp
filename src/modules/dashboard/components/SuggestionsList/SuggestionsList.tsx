import React, { FC, useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Heading from '~core/Heading';
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
  const { data, loading } = useColonySuggestionsQuery({
    variables: { colonyAddress },
  });

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const [setSuggestionStatus] = useSetSuggestionStatusMutation();
  const [createTaskFromSuggestion] = useCreateTaskFromSuggestionMutation({
    update: cacheUpdates.createTask(colonyAddress),
  });
  const handleNotPlanned = useCallback(
    async (id: string) => {
      await openDialog('ConfirmDialog').afterClosed();
      return setSuggestionStatus({
        variables: { input: { id, status: SuggestionStatus.NotPlanned } },
      });
    },
    [openDialog, setSuggestionStatus],
  );
  const handleDeleted = useCallback(
    async (id: string) => {
      await openDialog('ConfirmDialog').afterClosed();
      return setSuggestionStatus({
        variables: { input: { id, status: SuggestionStatus.Deleted } },
      });
    },
    [openDialog, setSuggestionStatus],
  );
  const handleCreateTask = useCallback(
    async (id: string) => {
      await openDialog('ConfirmDialog').afterClosed();
      const { data: createTaskData } = await createTaskFromSuggestion({
        variables: { input: { id } },
      });
      if (createTaskData && createTaskData.createTaskFromSuggestion) {
        const { id: taskId } = createTaskData.createTaskFromSuggestion;
        history.push(`/colony/${colonyName}/task/${taskId}`);
      }
    },
    [colonyName, createTaskFromSuggestion, history, openDialog],
  );

  const allSuggestions = (data && data.colony.suggestions) || [];

  const suggestions = useMemo(() => {
    const filteredSuggestions =
      domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
        ? allSuggestions
        : allSuggestions.filter(({ ethDomainId }) => ethDomainId === domainId);
    return filteredSuggestions.sort(createdAtDesc);
  }, [allSuggestions, domainId]);

  return loading || isFetchingDomains ? (
    <SpinnerLoader size="medium" />
  ) : (
    <div
      className={getMainClasses({}, styles, {
        isEmpty: suggestions.length === 0,
      })}
    >
      {suggestions.length > 0 ? (
        <ListGroup>
          {suggestions.map(suggestion => (
            <ListGroupItem appearance={{ padding: 'none' }} key={suggestion.id}>
              <SuggestionsListItem
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
  );
};

SuggestionsList.displayName = displayName;

export default (withDialog() as any)(SuggestionsList) as FC<InProps>;
