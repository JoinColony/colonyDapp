import React, { useMemo } from 'react';

import { FormattedMessage, defineMessages } from 'react-intl';
import classnames from 'classnames';

import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';

import styles from './CompleteKYCDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CoinMachine.CompleteKYCDialog.title',
    defaultMessage: 'Complete KYC',
  },
  description: {
    id: 'dashboard.CoinMachine.CompleteKYCDialog.description',
    defaultMessage: `To participate in the token sale you need to get your wallet address whitelisted.\n\nPlease contact the colony’s members to find out how.`,
  },
  buttonText: {
    id: 'dashboard.CoinMachine.CompleteKYCDialog.buttonText',
    defaultMessage: 'Close',
  },
});

const displayName = 'dashboard.CoinMachine.CompleteKYCDialog';

const CompleteKYCDialog = ({ cancel }: DialogProps) => {
  return (
    <Dialog cancel={cancel}>
      <div
        className={styles.container}
      >
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div
            className={styles.modalHeading}
          >
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
          </div>
          <div
            className={styles.modalContent}
          >
            <FormattedMessage {...MSG.description} />
          </div>
        </DialogSection>
      </div>
      <DialogSection appearance={{ theme: 'footer' }}>
        <div className={styles.confirmButtonContainer}>
          <Button
            appearance={{ theme: 'primary', size: 'large' }}
            text={MSG.buttonText}
            onClick={cancel}
          />
        </div>
      </DialogSection>
    </Dialog>
  );
};

CompleteKYCDialog.displayName = displayName;

export default CompleteKYCDialog;
