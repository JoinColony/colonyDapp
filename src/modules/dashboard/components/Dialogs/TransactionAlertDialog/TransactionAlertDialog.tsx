import React, { useCallback } from 'react';
import { MessageDescriptor, FormattedMessage } from 'react-intl';

import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import Button from '~core/Button';

import { ComplexMessageValues } from '~types/index';

import styles from './TransactionAlertDialog.css';

const displayName = 'dashboard.dialogs.TransactionAlertDialog';

interface Props extends DialogProps {
  text?: MessageDescriptor;
  textValues?: ComplexMessageValues;
}

const TransactionAlertDialog = ({ close, text, textValues }: Props) => {
  const handleModalClose = useCallback(() => close(), [close]);

  return (
    <Dialog cancel={close}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.content}>
          <FormattedMessage {...text} values={textValues} />
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.controls}>
          <Button onClick={handleModalClose} text={{ id: 'button.ok' }} />
        </div>
      </DialogSection>
    </Dialog>
  );
};

TransactionAlertDialog.displayName = displayName;

export default TransactionAlertDialog;
