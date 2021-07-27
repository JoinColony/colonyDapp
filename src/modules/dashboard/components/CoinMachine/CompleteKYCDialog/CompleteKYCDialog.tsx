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
  descriptionWhitelistedAgreement: {
    id:
      'dashboard.CoinMachine.CompleteKYCDialog.descriptionWhitelistedAgreement',
    defaultMessage: `Your address has been added to the whitelist. Please proceed to sign the sale agreement.`,
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

const CompleteKYCDialog = ({ cancel }: DialogProps) => {
  // @TODO: Add logic to actually determine all of those bools
  const isWhitelisted = false;
  const hasAgreement = false;
  const hasSignedAgreement = false;
  const hasKYCVerification = false;
  const descriptionText = useMemo(() => {
    if (!hasKYCVerification) {
      if (!isWhitelisted) {
        return MSG.description;
      }
      if (!hasSignedAgreement) {
        return MSG.descriptionWhitelistedAgreement;
      }
    } else if (isWhitelisted && hasKYCVerification) {
      if (hasAgreement && !hasSignedAgreement) {
        return MSG.descriptionKYCWhitelistedAgreement;
      }
      return MSG.descriptionKYCWhitelistedBuy;
    }

    return null;
  }, [isWhitelisted, hasAgreement, hasSignedAgreement, hasKYCVerification]);
  return (
    <Dialog cancel={cancel}>
      <div
        className={classnames(styles.container, {
          [styles.KYCContainer]: hasKYCVerification,
        })}
      >
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div
            className={classnames(styles.modalHeading, {
              [styles.KYCHeading]: hasKYCVerification,
            })}
          >
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
          </div>
          <div
            className={classnames(styles.modalContent, {
              [styles.KYCContent]: hasKYCVerification,
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
