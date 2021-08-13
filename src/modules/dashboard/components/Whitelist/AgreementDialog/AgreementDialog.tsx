import React from 'react';
import { defineMessages } from 'react-intl';

import Dialog, { DialogSection } from '~core/Dialog';
import Button from '~core/Button';
import Heading from '~core/Heading';

import { useWhitelistAgreementQuery } from '~data/index';

import AgreementContainer from './AgreementContainer';
import styles from './AgreementDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Extensions.Whitelist.AgreementDialog.title',
    defaultMessage: 'Sale agreement',
  },
  gotItButton: {
    id: 'dashboard.Extensions.Whitelist.AgreementDialog.gotItButton',
    defaultMessage: 'Got it',
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
        <AgreementContainer loading={loading} text={data?.whitelistAgreement} />
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
