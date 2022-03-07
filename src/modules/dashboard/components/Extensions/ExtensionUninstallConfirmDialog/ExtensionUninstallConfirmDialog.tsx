import React, { ReactNode, useState } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import InputLabel from '~core/Fields/InputLabel';

import { ExtensionsMSG } from '../extensionsMSG';
import styles from './ExtensionUninstallConfirmDialog.css';

interface Props {
  cancel: () => void;
  close: (val: any) => void;
  onClick?: () => void;
  heading?: string | MessageDescriptor;
  children?: ReactNode;
}

const ExtensionUninstallConfirmDialog = ({
  cancel,
  close,
  heading,
  children,
  onClick = () => close(null),
}: Props) => {
  const { formatMessage } = useIntl();
  const [isWarningInputValid, setIsWarningInputValid] = useState<boolean>(
    false,
  );

  const onWarningInputChange = (e) => {
    setIsWarningInputValid(e.target.value === 'I UNDERSTAND');
  };

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={heading}
          className={styles.title}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.content}>
          {children}
          <div className={styles.inputContainer}>
            <InputLabel
              label={ExtensionsMSG.typeInBox}
              appearance={{ colorSchema: 'grey' }}
            />
            <input
              name="warning"
              className={styles.input}
              onChange={onWarningInputChange}
              placeholder={formatMessage(ExtensionsMSG.warningPlaceholder)}
              data-test="uninstall-warning-input"
            />
          </div>
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={() => cancel()}
          text={{ id: 'button.cancel' }}
        />
        <Button
          appearance={{
            theme: 'primary',
            size: 'large',
          }}
          autoFocus
          onClick={onClick}
          text={{ id: 'button.confirm' }}
          style={{ width: styles.wideButton }}
          disabled={!isWarningInputValid}
          data-test="uninstall-confirm-button"
        />
      </DialogSection>
    </Dialog>
  );
};

export default ExtensionUninstallConfirmDialog;
