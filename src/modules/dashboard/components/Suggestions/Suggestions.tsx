import React from 'react';

import SuggestionCreate from '~dashboard/SuggestionCreate';
import SuggestionsList from '~dashboard/SuggestionsList';
import { Domain } from '~data/index';
import { Address } from '~types/index';

interface Props {
  colonyAddress: Address;
  colonyName: string;
  domainId: Domain['ethDomainId'];
}

const displayName = 'dashboard.Suggestions';

const Suggestions = ({ colonyAddress, colonyName, domainId }: Props) => (
  <div>
    <SuggestionCreate colonyAddress={colonyAddress} domainId={domainId} />
    <SuggestionsList
      colonyAddress={colonyAddress}
      colonyName={colonyName}
      domainId={domainId}
    />
  </div>
);

Suggestions.displayName = displayName;

export default Suggestions;
