import React, { useCallback } from 'react';
import { Motion } from '~pages/ExpenditurePage/ExpenditurePage';

import { Props as StagesProps } from './FormStages';
import Stages from './Stages';

const displayName = 'dashboard.ExpenditurePage.LockedStages';

interface Props extends StagesProps {
  motion?: Motion;
}

const LockedStages = ({
  states,
  activeStateId,
  setActiveStateId,
  pendingChanges,
  forcedChanges,
  motion,
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
        motion,
      }}
    />
  );
};

LockedStages.displayName = displayName;

export default LockedStages;
