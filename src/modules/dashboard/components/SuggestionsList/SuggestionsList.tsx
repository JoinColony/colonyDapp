import React from 'react';
import { defineMessages } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';
import { useColonySuggestionsQuery } from '~data/index';
import { Address } from '~types/index';
import Heading from '~core/Heading';
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
}

const displayName = 'Dashboard.SuggestionsList';

const SuggestionsList = ({ colonyAddress }: Props) => {
  const { data, loading } = useColonySuggestionsQuery({
    variables: { colonyAddress },
  });
  if (loading) {
    return <SpinnerLoader size="medium" />;
  }

  const suggestions = (data && data.colony.suggestions) || [];

  return (
    <div
      className={getMainClasses({}, styles, {
        isEmpty: suggestions.length === 0,
      })}
    >
      {suggestions.length > 0 ? (
        <ul>
          {suggestions.map(suggestion => (
            <li key={suggestion.id}>{suggestion.title}</li>
          ))}
        </ul>
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
