import React, { useState } from 'react';

import ColonyHomeLayout from '~dashboard/ColonyHome/ColonyHomeLayout';
import ColonyNewDecision from '~dashboard/ColonyNewDecision';

import { LOCAL_STORAGE_DECISION_KEY } from '~constants';
import { DecisionDetails } from '~types/index';

import ColonyDecisions from './ColonyDecisions';

const ColonyDecisionsWrapper = ({
  colony,
  filteredDomainId,
  setDomainIdFilter,
}: any) => {
  const [draftDecision, setDraftDecision] = useState<
    DecisionDetails | undefined
  >(
    localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) === null
      ? undefined
      : JSON.parse(localStorage.getItem(LOCAL_STORAGE_DECISION_KEY) || ''),
  );

  return (
    <ColonyHomeLayout
      colony={colony}
      filteredDomainId={filteredDomainId}
      onDomainChange={setDomainIdFilter}
      newItemButton={
        <ColonyNewDecision
          colony={colony}
          ethDomainId={filteredDomainId}
          draftDecision={draftDecision}
          removeDraftDecision={() => setDraftDecision(undefined)}
        />
      }
    >
      <ColonyDecisions
        colony={colony}
        ethDomainId={filteredDomainId}
        draftDecision={draftDecision}
        removeDraftDecision={() => setDraftDecision(undefined)}
      />
    </ColonyHomeLayout>
  );
};

export default ColonyDecisionsWrapper;
