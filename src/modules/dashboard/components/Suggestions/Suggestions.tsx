import React from 'react';

import SuggestionCreate from '~dashboard/SuggestionCreate';
import { Address } from '~types/index';
import { Domain } from '~data/index';
import SuggestionsList from '~dashboard/SuggestionsList';

interface Props {
  colonyAddress: Address;
  domainId: Domain['ethDomainId'];
}

const displayName = 'dashboard.Suggestions';

const Suggestions = ({ colonyAddress, domainId }: Props) => (
  <div>
    <SuggestionCreate colonyAddress={colonyAddress} domainId={domainId} />
    <SuggestionsList colonyAddress={colonyAddress} />
  </div>
);

Suggestions.displayName = displayName;

export default Suggestions;
