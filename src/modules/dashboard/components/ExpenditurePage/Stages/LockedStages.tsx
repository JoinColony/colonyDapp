import React, { useCallback, useMemo } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';

import Tag from '~core/Tag';
import { Colony } from '~data/index';
import { ExpenditureTypes, State } from '~pages/ExpenditurePage/types';

import { LANDING_PAGE_ROUTE } from '~routes/routeConstants';
import { Recipient } from '../Payments/types';

import { Motion, MotionStatus, MotionType, Status } from './constants';
import LinkedMotions from './LinkedMotions';
import Stages from './Stages';
import styles from './Stages.css';

const MSG = defineMessages({
  motion: {
    id: 'dashboard.ExpenditurePage.Stages.LockedStages.motion',
    defaultMessage: `You can't {action} unless motion ends`,
  },
  activeMotion: {
    id: 'dashboard.ExpenditurePage.Stages.LockedStages.activeMotion',
    defaultMessage: 'There is an active motion for this expenditure',
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
  recipients?: Recipient[];
  colony: Colony;
  expenditureType?: ExpenditureTypes;
}

const LockedStages = ({
  states,
  activeStateId,
  setActiveStateId,
  motion,
  status,
  handleCancelExpenditure,
  recipients,
  colony,
  expenditureType,
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
          {motion.type === MotionType.Edit &&
          motion.status === MotionStatus.Pending
            ? formatMessage(MSG.activeMotion)
            : formatMessage(MSG.motion, {
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
          recipients,
          colony,
          expenditureType,
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
