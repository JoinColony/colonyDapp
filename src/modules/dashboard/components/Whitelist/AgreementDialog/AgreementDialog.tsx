import React from 'react';
import { defineMessages } from 'react-intl';

import Dialog, { DialogSection } from '~core/Dialog';
import Button from '~core/Button';
import Heading from '~core/Heading';

import styles from './AgreementDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Extensions.WhitelisExtension.AgreementDialog.title',
    defaultMessage: 'Sale agreement',
  },
  gotiItButton: {
    id: 'dashboard.Extensions.WhitelisExtension.AgreementDialog.gotiItButton',
    defaultMessage: 'Got it',
  },
});

interface Props {
  cancel: () => void;
  close: () => void;
}

const AgreementDialog = ({ cancel, close }: Props) => {
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
        <div className={styles.agreementContainer}>AGREEMENT PLACEHOLDER</div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={close}
          text={MSG.gotiItButton}
        />
      </DialogSection>
    </Dialog>
  );
};

export default AgreementDialog;
