import React, { useCallback } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Tag from '~core/Tag';
import { Motion, State } from '~pages/ExpenditurePage/ExpenditurePage';
import { LANDING_PAGE_ROUTE } from '~routes/routeConstants';
import { MotionStatus, Status } from './constants';
import LinkedMotions from './LinkedMotions';

import Stages from './Stages';

const MSG = defineMessages({
  motion: {
    id: 'dashboard.ExpenditurePage.Stages.motion',
    defaultMessage: `There is an active motion for this expenditure`,
  },
});

const displayName = 'dashboard.ExpenditurePage.LockedStages';

interface Props {
  states: State[];
  setActiveStateId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeStateId?: string;
  motion?: Motion;
  status?: Status;
}

const LockedStages = ({
  states,
  activeStateId,
  setActiveStateId,
  motion,
  status,
}: Props) => {
  const activeState = states.find((state) => state.id === activeStateId);
  const { formatMessage } = useIntl();

  const handleButtonClick = useCallback(async () => {
    activeState?.buttonAction();
  }, [activeState]);

  return (
    <>
      {motion?.status === MotionStatus.Pending && (
        <Tag
          appearance={{
            theme: 'golden',
          }}
        >
          {formatMessage(MSG.motion)}
        </Tag>
      )}
      <Stages
        {...{
          states,
          activeStateId,
          setActiveStateId,
          handleButtonClick,
          motion,
          status,
        }}
      />
      {motion && (
        // motion link needs to be changed and redirects to actual motions page
        <LinkedMotions
          status={motion.status}
          motion={motion.type}
          motionLink={LANDING_PAGE_ROUTE}
          id="25"
        />
      )}
    </>
  );
};

LockedStages.displayName = displayName;

export default LockedStages;
