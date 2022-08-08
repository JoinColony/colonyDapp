import React, { useCallback, useMemo } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';

import Tag from '~core/Tag';
import { Motion, State } from '~pages/ExpenditurePage/ExpenditurePage';
import { LANDING_PAGE_ROUTE } from '~routes/routeConstants';

import { MotionStatus, Status } from './constants';
import LinkedMotions from './LinkedMotions';
import Stages from './Stages';
import styles from './Stages.css';

const MSG = defineMessages({
  motion: {
    id: 'dashboard.ExpenditurePage.Stages.motion',
    defaultMessage: `You can't {action} unless motion ends`,
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages.LockedStages';

interface Props {
  states: State[];
  setActiveStateId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeStateId?: string;
  motion?: Motion;
  status?: Status;
  handleCancelExpenditure?: () => void;
}

const LockedStages = ({
  states,
  activeStateId,
  setActiveStateId,
  motion,
  status,
  handleCancelExpenditure,
}: Props) => {
  const activeState = states.find((state) => state.id === activeStateId);
  const { formatMessage } = useIntl();

  const handleButtonClick = useCallback(async () => {
    activeState?.buttonAction();
  }, [activeState]);

  const formattedLabel = useMemo(
    () => (text: string | MessageDescriptor | undefined): string => {
      if (undefined) {
        return '';
      }
      if (typeof text === 'string') {
        return text;
      }
      if (typeof text === 'object' && text?.id) {
        return formatMessage(text);
      }
      return '';
    },
    [formatMessage],
  );

  return (
    <div className={styles.tagStagesWrapper}>
      {motion?.status === MotionStatus.Pending && (
        <Tag
          appearance={{
            theme: 'golden',
            colorSchema: 'fullColor',
          }}
        >
          {formatMessage(MSG.motion, {
            action: formattedLabel(activeState?.buttonText),
          })}
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
          handleCancelExpenditure,
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
    </div>
  );
};

LockedStages.displayName = displayName;

export default LockedStages;
