import React, { useState, useEffect } from 'react';

import { defineMessages } from 'react-intl';

import SynapsClient from '@synaps-io/verify.js';
import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import { useLoggedInUser } from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { SpinnerLoader } from '~core/Preloaders';
import { getKycStatus } from './kycApi';
import { authenticateKYC } from '../../../../../api';

import styles from './SynapsKYCDialog.css';

const MSG = defineMessages({
  buttonText: {
    id: 'dashboard.CoinMachine.SynapsKYCDialog.buttonText',
    defaultMessage: 'Proceed',
  },
});

const displayName = 'dashboard.CoinMachine.SynapsKYCDialog';

const SynapsKYCDialog = ({ cancel }: DialogProps) => {
  const [kycDetails, setKycDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { walletAddress } = useLoggedInUser();

  useEffect(() => {
    const initSynaps = async () => {
      setIsLoading(true);
      const wallet = TEMP_getContext(ContextModule.Wallet);
      const sessionId = await authenticateKYC(wallet);
      const Synaps = new SynapsClient(sessionId, 'individual');
      Synaps.init({
        type: 'embed',
      });
      Synaps.on('finish', async () => {
        const data = await getKycStatus(sessionId);
        if (data?.status === 'VERIFIED') {
          setIsValid(true);
        }
    });
      setIsLoading(false);
    };
    if (!walletAddress) return;
    initSynaps();
  }, [walletAddress]);

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div id="synaps-embed" className={styles.content}>
          {isLoading && <SpinnerLoader appearance={{ size: 'large' }} />}
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.buttonText}
          disabled={!isValid}
          onClick={cancel}
        />
      </DialogSection>
    </Dialog>
  );
};

SynapsKYCDialog.displayName = displayName;

export default SynapsKYCDialog;
