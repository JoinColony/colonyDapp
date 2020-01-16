import React from 'react';

import SuggestionCreate from '~dashboard/SuggestionCreate';
import { Address } from '~types/index';
import { Domain } from '~data/index';

interface Props {
  colonyAddress: Address;
  domainId: Domain['ethDomainId'];
}

const displayName = 'dashboard.Suggestions';

const Suggestions = ({ colonyAddress, domainId }: Props) => (
  <div>
    <SuggestionCreate colonyAddress={colonyAddress} domainId={domainId} />
  </div>
);

Suggestions.displayName = displayName;

export default Suggestions;
