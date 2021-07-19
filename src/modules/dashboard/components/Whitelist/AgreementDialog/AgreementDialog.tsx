import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Dialog, { DialogSection } from '~core/Dialog';
import Button from '~core/Button';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';

import { useWhitelistAgreementQuery } from '~data/index';

import styles from './AgreementDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Extensions.WhitelisExtension.AgreementDialog.title',
    defaultMessage: 'Sale agreement',
  },
  gotItButton: {
    id: 'dashboard.Extensions.WhitelisExtension.AgreementDialog.gotItButton',
    defaultMessage: 'Got it',
  },
  ipfsError: {
    id: 'dashboard.Extensions.WhitelisExtension.AgreementDialog.ipfsError',
    defaultMessage: `There is a problem loading the agreement. Please, try again or contact colony admins.`,
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
  agreementHash: string;
}

const AgreementDialog = ({ cancel, close, agreementHash }: Props) => {
  const { data, loading } = useWhitelistAgreementQuery({
    variables: { agreementHash },
    fetchPolicy: 'network-only',
  });

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      <DialogSection>
        {loading ? (
          <SpinnerLoader appearance={{ size: 'huge', theme: 'primary' }} />
        ) : (
          <div className={styles.agreementContainer}>
            {data?.whitelistAgreement || (
              <div className={styles.error}>
                <FormattedMessage {...MSG.ipfsError} />
              </div>
            )}
          </div>
        )}
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={close}
          text={MSG.gotItButton}
        />
      </DialogSection>
    </Dialog>
  );
};

export default AgreementDialog;
