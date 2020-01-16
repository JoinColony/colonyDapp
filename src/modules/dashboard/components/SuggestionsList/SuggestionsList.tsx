import React from 'react';

import { Domain } from '~data/index';
import { Address } from '~types/index';

interface Props {
  colonyAddress: Address;
  domainId: Domain['ethDomainId'];
}

const displayName = 'Dashboard.SuggestionsList';

const SuggestionsList = ({ colonyAddress, domainId }: Props) => {
  // @todo use suggestions query here
  const suggestions = ['okay', 'alright'];
  return (
    <div>
      {colonyAddress} {domainId}
      <ul>
        {suggestions.map(suggestion => (
          <li key={suggestion}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
};

SuggestionsList.displayName = displayName;

export default SuggestionsList;
