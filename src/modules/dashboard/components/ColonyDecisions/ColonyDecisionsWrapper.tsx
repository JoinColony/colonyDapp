import React, { useState } from 'react';

import ColonyHomeLayout from '~dashboard/ColonyHome/ColonyHomeLayout';
import ColonyNewDecision from '~dashboard/ColonyNewDecision';

import { LOCAL_STORAGE_DECISION_KEY } from '~constants';
import { DecisionDetails } from '~types/index';
import { Colony } from '~data/index';

import ColonyDecisions from './ColonyDecisions';

interface Props {
  colony: Colony;
  filteredDomainId: number;
  onDomainChange?: (domainId: number) => void;
}

const ColonyDecisionsWrapper = ({
  colony,
  filteredDomainId,
  onDomainChange,
}: Props) => {
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
      onDomainChange={onDomainChange}
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
