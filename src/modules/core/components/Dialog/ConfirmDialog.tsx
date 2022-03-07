import React, { ReactNode } from 'react';
import {
  MessageDescriptor,
  defineMessages,
  FormattedMessage,
} from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Dialog from './Dialog';
import DialogSection from './DialogSection';

import styles from './ConfirmDialog.css';

const MSG = defineMessages({
  defaultHeading: {
    id: 'ConfirmDialog.defaultHeading',
    defaultMessage: 'Please confirm',
  },
  defaultText: {
    id: 'ConfirmDialog.defaultText',
    defaultMessage: 'Are you sure?',
  },
});

interface Appearance {
  theme?: 'primary' | 'danger';
}

interface Props {
  cancel: () => void;
  close: (val: any) => void;
  onClick?: () => void;

  /** Appearance object */
  appearance?: Appearance;
  heading?: string | MessageDescriptor;
  children?: ReactNode;
  cancelButtonText?: string | MessageDescriptor;
  confirmButtonText?: string | MessageDescriptor;
}

const ConfirmDialog = ({
  cancel,
  close,
  heading = MSG.defaultHeading,
  children,
  cancelButtonText = { id: 'button.cancel' },
  confirmButtonText = { id: 'button.confirm' },
  appearance,
  onClick = () => close(null),
}: Props) => (
  <Dialog cancel={cancel}>
    <DialogSection appearance={{ theme: 'heading' }}>
      <Heading
        appearance={{ size: 'medium', margin: 'none' }}
        text={heading}
        className={styles.title}
      />
    </DialogSection>
    <DialogSection>
      <div className={styles.content}>
        {children || <FormattedMessage {...MSG.defaultText} />}
      </div>
    </DialogSection>
    <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
      <Button
        appearance={{ theme: 'secondary', size: 'large' }}
        onClick={() => cancel()}
        text={cancelButtonText}
      />
      <Button
        appearance={{
          theme: (appearance && appearance.theme) || 'primary',
          size: 'large',
        }}
        autoFocus
        onClick={onClick}
        text={confirmButtonText}
        style={{ width: styles.wideButton }}
        data-test="confirm-button"
      />
    </DialogSection>
  </Dialog>
);

export default ConfirmDialog;
