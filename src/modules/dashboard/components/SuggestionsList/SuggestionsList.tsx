import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';
import { useColonySuggestionsQuery, Domain } from '~data/index';
import { Address } from '~types/index';
import Heading from '~core/Heading';
import { getMainClasses } from '~utils/css';

import styles from './SuggestionsList.css';
import ListGroup from '~core/ListGroup';
import ListGroupItem from '~core/ListGroup/ListGroupItem';
import SuggestionsListItem from '~dashboard/SuggestionsListItem';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

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

const displayName = 'Dashboard.SuggestionsList';

const SuggestionsList = ({ colonyAddress, domainId }: Props) => {
  const { data, loading } = useColonySuggestionsQuery({
    variables: { colonyAddress },
  });

  const allSuggestions = (data && data.colony.suggestions) || [];

  const suggestions = useMemo(
    () =>
      domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
        ? allSuggestions
        : allSuggestions.filter(({ ethDomainId }) => ethDomainId === domainId),
    [allSuggestions, domainId],
  );

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
            <ListGroupItem key={suggestion.id}>
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
