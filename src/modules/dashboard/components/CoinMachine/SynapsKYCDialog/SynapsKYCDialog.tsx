import React, { useState, useEffect } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

import SynapsClient from '@synaps-io/verify.js';
import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import { Address } from '~types/index';
import { useLoggedInUser, useUserWhitelistStatusQuery } from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';

import { getKycStatus } from './kycApi';
import { authenticateKYC } from '../../../../../api';

import styles from './SynapsKYCDialog.css';

const MSG = defineMessages({
  buttonText: {
    id: 'dashboard.CoinMachine.SynapsKYCDialog.buttonText',
    defaultMessage: 'Proceed',
  },
  verified: {
    id: 'dashboard.CoinMachine.SynapsKYCDialog.verified',
    defaultMessage: 'You passed KYC!',
  },
  verifiedIconTitle: {
    id: 'dashboard.CoinMachine.SynapsKYCDialog.verifiedIconTitle',
    defaultMessage: 'You are verified! Congrats',
  },
});

const displayName = 'dashboard.CoinMachine.SynapsKYCDialog';

interface CustomDialogProps {
  colonyAddress: Address;
}

type Props = DialogProps & CustomDialogProps;

const SynapsKYCDialog = ({ cancel, colonyAddress }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { walletAddress } = useLoggedInUser();

  const { refetch } = useUserWhitelistStatusQuery({
    variables: { colonyAddress, userAddress: walletAddress },
  });

  useEffect(() => {
    const initSynaps = async () => {
      setIsLoading(true);
      const wallet = TEMP_getContext(ContextModule.Wallet);
      const sessionId = await authenticateKYC(wallet);
      const kyc = await getKycStatus(sessionId);
      if (kyc?.status === 'VERIFIED') {
        setIsValid(true);
        setIsLoading(false);
        return;
      }
      const Synaps = new SynapsClient(sessionId, 'individual');
      Synaps.init({
        type: 'embed',
      });
      Synaps.on('finish', async () => {
        const id = setInterval(async () => {
          const data = await getKycStatus(sessionId);
          if (data?.status === 'VERIFIED') {
            setIsValid(true);
          }
        }, 1000);
        return () => clearInterval(id);
      });
      setIsLoading(false);
    };
    if (!walletAddress) return;
    initSynaps();
  }, [walletAddress]);

  const onProceed = () => {
    refetch();
    cancel();
  };

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.content}>
          {isLoading && <SpinnerLoader appearance={{ size: 'large' }} />}
          {!isLoading && isValid && (
            <div className={styles.verified}>
              <Icon name="emoji-party" title={MSG.verifiedIconTitle} />
              <FormattedMessage {...MSG.verified} />
            </div>
          )}
          {!isLoading && !isValid && (
            <div className={styles.synaps} id="synaps-embed" />
          )}
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.buttonText}
          disabled={!isValid}
          onClick={onProceed}
        />
      </DialogSection>
    </Dialog>
  );
};

SynapsKYCDialog.displayName = displayName;

export default SynapsKYCDialog;
