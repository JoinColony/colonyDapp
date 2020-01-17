import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Heading from '~core/Heading';
import ListGroup from '~core/ListGroup';
import ListGroupItem from '~core/ListGroup/ListGroupItem';
import { SpinnerLoader } from '~core/Preloaders';
import SuggestionsListItem from '~dashboard/SuggestionsListItem';
import { Domain, useColonySuggestionsQuery, OneSuggestion } from '~data/index';
import { Address } from '~types/index';
import { getMainClasses } from '~utils/css';

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

interface Props {
  colonyAddress: Address;
  domainId: Domain['ethDomainId'];
}

const createdAtDesc = (
  { createdAt: createdAtA }: OneSuggestion,
  { createdAt: createdAtB }: OneSuggestion,
) => new Date(createdAtB).getTime() - new Date(createdAtA).getTime();

const displayName = 'Dashboard.SuggestionsList';

const SuggestionsList = ({ colonyAddress, domainId }: Props) => {
  const { data, loading } = useColonySuggestionsQuery({
    variables: { colonyAddress },
  });

  const allSuggestions = (data && data.colony.suggestions) || [];

  const suggestions = useMemo(() => {
    const filteredSuggestions =
      domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
        ? allSuggestions
        : allSuggestions.filter(({ ethDomainId }) => ethDomainId === domainId);
    return filteredSuggestions.sort(createdAtDesc);
  }, [allSuggestions, domainId]);

  return loading ? (
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
              <SuggestionsListItem suggestion={suggestion} />
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

export default SuggestionsList;
