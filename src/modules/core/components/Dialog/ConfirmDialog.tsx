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
    <DialogSection appearance={{ border: 'bottom' }}>
      <Heading appearance={{ size: 'medium', margin: 'none' }} text={heading} />
    </DialogSection>
    <DialogSection appearance={{ border: 'bottom' }}>
      {children || <FormattedMessage {...MSG.defaultText} />}
    </DialogSection>
    <DialogSection appearance={{ align: 'right' }}>
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
      />
    </DialogSection>
  </Dialog>
);

export default ConfirmDialog;
