import React from 'react';
import { useIntl } from 'react-intl';

import Button from '~core/Button';
import { Stages } from '~pages/IncorporationPage/constants';
import { StageObject } from '~pages/IncorporationPage/types';

import styles from './StagesButton.css';

const displayName = 'dashboard.Incorporation.Stages.StagesButton';

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
