import React from 'react';
import { useIntl } from 'react-intl';

import Button from '~core/Button';
import { Tooltip } from '~core/Popover';
import { Stages } from '~pages/IncorporationPage/constants';
import { StageObject } from '~pages/IncorporationPage/types';

import styles from './StagesButton.css';

const displayName = 'dashboard.ExpenditurePage.Stages.StagesButton';

interface Props {
  activeStage?: StageObject;
  buttonDisabled?: boolean;
  buttonAction?: VoidFunction;
}

const StagesButton = ({ activeStage, buttonDisabled, buttonAction }: Props) => {
  const { formatMessage } = useIntl();
  const buttonText =
    typeof activeStage?.buttonText === 'string'
      ? activeStage.buttonText
      : activeStage?.buttonText && formatMessage(activeStage.buttonText);

  if (!activeStage) return null;

  if (
    activeStage.id === Stages.Processing ||
    activeStage.id === Stages.Complete
  ) {
    return null;
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
            disabled={buttonDisabled}
            className={styles.button}
            type="submit"
            onClick={buttonAction}
          >
            {buttonText}
          </Button>
        </Tooltip>
      </span>
    );
  }

  return (
    <Button
      disabled={buttonDisabled}
      type="submit"
      className={styles.button}
      onClick={buttonAction}
    >
      {buttonText}
    </Button>
  );
};

StagesButton.displayName = displayName;

export default StagesButton;
