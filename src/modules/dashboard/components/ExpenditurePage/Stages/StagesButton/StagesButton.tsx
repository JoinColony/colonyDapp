import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import Button from '~core/Button';
import { Tooltip } from '~core/Popover';
import Tag from '~core/Tag';
import { ExpenditureTypes, State } from '~pages/ExpenditurePage/types';

import { Motion, MotionStatus, Stage, Status } from '../constants';
import { buttonStyles } from '../Stages';

import styles from './StagesButton.css';

const MSG = defineMessages({
  cancelled: {
    id: `dashboard.ExpenditurePage.Stages.StagesButton.cancelled`,
    defaultMessage: 'Cancelled',
  },
  tooltipNoPermissionToRealese: {
    id: `dashboard.ExpenditurePage.Stages.StagesButton.tooltipNoPermissionToRealese`,
    defaultMessage: 'You need to create a Motion to release funds.',
  },
});

const displayName = 'dashboard.ExpenditurePage.Stages.StagesButton';

interface Props {
  activeState?: State;
  canReleaseFunds: boolean;
  handleButtonClick: () => void;
  status?: Status;
  motion?: Motion;
  buttonDisabled?: boolean;
}

const StagesButton = ({
  activeState,
  canReleaseFunds,
  handleButtonClick,
  status,
  motion,
  buttonDisabled,
}: Props) => {
  const { formatMessage } = useIntl();
  const buttonText =
    typeof activeState?.buttonText === 'string'
      ? activeState.buttonText
      : activeState?.buttonText && formatMessage(activeState.buttonText);

  if (!activeState) {
    return null;
  }

  if (
    activeState.id === Stage.Funded &&
    expenditureType === ExpenditureTypes.Staged
  ) {
    return null;
  }

  if (status === Status.Cancelled || status === Status.ForceCancelled) {
    return <Tag text={MSG.cancelled} className={styles.claimed} />;
  }

  if (activeState.id === Stage.Claimed) {
    return <Tag text={buttonText} className={styles.claimed} />;
  }

  if (activeState.id === Stage.Claimed) {
    return <Tag text={buttonText} className={styles.claimed} />;
  }

  if (activeState.id === Stage.Released) {
    return null;
  }

  if (activeState.id === Stage.Funded) {
    return (
      <>
        {canReleaseFunds ? (
          <Button
            onClick={activeState?.buttonAction}
            style={buttonStyles}
            disabled={buttonDisabled}
          >
            {buttonText}
          </Button>
        ) : (
          <Tooltip
            placement="top"
            isOpen
            content={
              <div className={styles.buttonTooltip}>
                <FormattedMessage {...MSG.tooltipNoPermissionToRealese} />
              </div>
            }
          >
            <Button
              onClick={activeState?.buttonAction}
              style={buttonStyles}
              disabled
            >
              {buttonText}
            </Button>
          </Tooltip>
        )}
      </>
    );
  }

  if (activeState?.buttonTooltip) {
    return (
      <Tooltip
        placement="top"
        content={
          <div className={styles.buttonTooltip}>
            {typeof activeState.buttonTooltip === 'string'
              ? activeState.buttonTooltip
              : formatMessage(activeState.buttonTooltip)}
          </div>
        }
      >
        <Button
          onClick={handleButtonClick}
          style={buttonStyles}
          disabled={
            activeState.id === Stage.Claimed ||
            motion?.status === MotionStatus.Pending ||
            buttonDisabled
          }
        >
          {buttonText}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button
      onClick={handleButtonClick}
      style={buttonStyles}
      disabled={
        activeState.id === Stage.Claimed ||
        motion?.status === MotionStatus.Pending ||
        buttonDisabled
      }
      type="submit"
    >
      {buttonText}
    </Button>
  );
};

StagesButton.displayName = displayName;

export default StagesButton;
