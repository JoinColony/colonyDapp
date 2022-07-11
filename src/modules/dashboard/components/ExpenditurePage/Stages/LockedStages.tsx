import React, { useCallback } from 'react';

import { Props } from './FormStages';
import Stages from './Stages';

const displayName = 'dashboard.ExpenditurePage.LockedStages';

const LockedStages = ({
  states,
  activeStateId,
  setActiveStateId,
  pendingChanges,
  forcedChanges,
}: Props) => {
  const activeState = states.find((state) => state.id === activeStateId);

  const handleButtonClick = useCallback(async () => {
    activeState?.buttonAction();
  }, [activeState]);

  return (
    <Stages
      {...{
        states,
        activeStateId,
        forcedChanges,
        pendingChanges,
        setActiveStateId,
        handleButtonClick,
      }}
    />
  );
};

LockedStages.displayName = displayName;

export default LockedStages;
