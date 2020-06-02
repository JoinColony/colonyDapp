import React from 'react';

import SuggestionCreate from '~dashboard/SuggestionCreate';
import SuggestionsList from '~dashboard/SuggestionsList';
import { Colony, Domain } from '~data/index';

interface Props {
  colony: Colony;
  domainId: Domain['ethDomainId'];
}

const displayName = 'dashboard.Suggestions';

const Suggestions = ({
  colony,
  colony: { colonyAddress },
  domainId,
}: Props) => (
  <div>
    <SuggestionCreate colonyAddress={colonyAddress} domainId={domainId} />
    <SuggestionsList colony={colony} domainId={domainId} />
  </div>
);

Suggestions.displayName = displayName;

export default Suggestions;
