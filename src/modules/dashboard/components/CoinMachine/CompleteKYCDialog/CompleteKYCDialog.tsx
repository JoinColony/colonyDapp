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
    defaultMessage: 'Proceed',
  },
  descriptionKYCWhitelistedBuy: {
    id: 'dashboard.CoinMachine.CompleteKYCDialog.descriptionWhitelistedBuy',
    defaultMessage: `Your address has been added to the whitelist. Please proceed to buy tokens.`,
  },
  descriptionKYCWhitelistedAgreement: {
    id: `dashboard.CoinMachine.CompleteKYCDialog.descriptionKYCWhitelistedAgreement`,
    defaultMessage: `Your address has been added to the whitelist. Please proceed to sign the sale agreement.`,
  },
});

const displayName = 'dashboard.CoinMachine.CompleteKYCDialog';

interface Props extends DialogProps {
  isKYCRequired: boolean;
  signatureRequired: boolean;
  isWhitelisted: boolean;
}

const CompleteKYCDialog = ({ cancel, isKYCRequired, signatureRequired, isWhitelisted }: Props) => {
  const descriptionText = useMemo(() => {
    if (isWhitelisted) {
      return MSG.descriptionKYCWhitelistedBuy;
    }
    if (isKYCRequired) {
      return MSG.description;
    }
    if (signatureRequired) {
      return MSG.descriptionKYCWhitelistedAgreement;
    }

    return null;
  }, [isWhitelisted, isKYCRequired, signatureRequired]);
  return (
    <Dialog cancel={cancel}>
      <div
        className={classnames(styles.container, {
          [styles.KYCContainer]: !isKYCRequired,
        })}
      >
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div
            className={classnames(styles.modalHeading, {
              [styles.KYCHeading]: !isKYCRequired,
            })}
          >
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
          </div>
          <div
            className={classnames(styles.modalContent, {
              [styles.KYCContent]: !isKYCRequired,
            })}
          >
            <FormattedMessage {...descriptionText} />
          </div>
        </DialogSection>
      </div>
      <DialogSection appearance={{ theme: 'footer' }}>
        <div className={styles.confirmButtonContainer}>
          <Button
            appearance={{ theme: 'primary', size: 'large' }}
            text={MSG.buttonText}
            onClick={cancel}
            disabled={!isWhitelisted}
          />
        </div>
      </DialogSection>
    </Dialog>
  );
};

CompleteKYCDialog.displayName = displayName;

export default CompleteKYCDialog;
