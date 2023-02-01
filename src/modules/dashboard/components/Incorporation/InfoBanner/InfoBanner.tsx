import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { Stages } from '~pages/IncorporationPage/constants';

import styles from './InfoBanner.css';

const MSG = defineMessages({
  titleProcessing: {
    id: 'dashboard.Incorporation.InfoBanner.titleProcessing',
    defaultMessage: 'Check email and spam folder',
  },
  titleCompleted: {
    id: 'dashboard.Incorporation.InfoBanner.titleCompleted',
    defaultMessage: 'Application Complete',
  },
  descriptionProcessing: {
    id: 'dashboard.Incorporation.InfoBanner.descriptionProcessing',
    defaultMessage: `Your Incorporation has been approved, each protector needs to sign and return the Indemnity form that they should have received from Korporatio.`,
  },
  descriptionCompleted: {
    id: 'dashboard.Incorporation.InfoBanner.descriptionCompleted',
    defaultMessage: `Your DAO incorporation has been completed. Your DAO is now able to interact with traditional organisations and your contributors are now protected.`,
  },
  buttonText: {
    id: 'dashboard.Incorporation.InfoBanner.buttonText',
    defaultMessage: 'View details',
  },
});

const displayName = 'dashboard.Incorporation.InfoBanner';

export interface Props {
  activeStageId: Stages;
}

const InfoBanner = ({ activeStageId }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.title}>
          <FormattedMessage
            {...(activeStageId === Stages.Processing
              ? MSG.titleProcessing
              : MSG.titleCompleted)}
          />
        </div>
        <div className={styles.description}>
          <FormattedMessage
            {...(activeStageId === Stages.Processing
              ? MSG.descriptionProcessing
              : MSG.descriptionCompleted)}
          />
        </div>
      </div>
      {activeStageId === Stages.Complete && (
        <div className={styles.buttonsWrapper}>
          <Button text={MSG.buttonText} className={styles.verifyButton} />
        </div>
      )}
    </div>
  );
};

InfoBanner.displayName = displayName;

export default InfoBanner;
