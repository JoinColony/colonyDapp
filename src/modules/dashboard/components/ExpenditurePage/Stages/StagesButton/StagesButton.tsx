import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import Button from '~core/Button';
import { Tooltip } from '~core/Popover';
import Tag from '~core/Tag';
import { ExpenditureTypes, StageObject } from '~pages/ExpenditurePage/types';

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
  activeStage?: StageObject;
  canReleaseFunds: boolean;
  handleButtonClick: () => void;
  status?: Status;
  motion?: Motion;
  buttonDisabled?: boolean;
  expenditureType?: ExpenditureTypes;
}

const StagesButton = ({
  activeStage,
  canReleaseFunds,
  handleButtonClick,
  status,
  motion,
  buttonDisabled,
  expenditureType,
}: Props) => {
  const { formatMessage } = useIntl();
  const buttonText =
    typeof activeStage?.buttonText === 'string'
      ? activeStage.buttonText
      : activeStage?.buttonText && formatMessage(activeStage.buttonText);

  if (!activeStage) {
    return null;
  }

  if (status === Status.Cancelled || status === Status.ForceCancelled) {
    return <Tag text={MSG.cancelled} className={styles.claimed} />;
  }

  if (activeStage.id === Stage.Claimed) {
    return <Tag text={buttonText} className={styles.claimed} />;
  }

  if (activeStage.id === Stage.Released) {
    return null;
  }

  if (
    activeStage.id === Stage.Funded &&
    expenditureType === ExpenditureTypes.Staged
  ) {
    return null;
  }

  if (activeStage.id === Stage.Funded) {
    return (
      <>
        {canReleaseFunds ? (
          <Button
            onClick={activeStage?.buttonAction}
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
              onClick={activeStage?.buttonAction}
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

  if (activeStage?.buttonTooltip) {
    return (
      <span className={styles.buttonWithTooltip}>
        <Tooltip
          placement="top"
          content={
            <div className={styles.buttonTooltip}>
              {typeof activeStage.buttonTooltip === 'string'
                ? activeStage.buttonTooltip
                : formatMessage(activeStage.buttonTooltip)}
            </div>
          }
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
            ],
          }}
        >
          <Button
            onClick={handleButtonClick}
            style={buttonStyles}
            disabled={
              activeStage.id === Stage.Claimed ||
              motion?.status === MotionStatus.Pending ||
              buttonDisabled
            }
          >
            {buttonText}
          </Button>
        </Tooltip>
      </span>
    );
  }

  return (
    <Button
      onClick={handleButtonClick}
      style={buttonStyles}
      disabled={
        activeStage.id === Stage.Claimed ||
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
