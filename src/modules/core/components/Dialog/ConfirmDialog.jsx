/* @flow */

import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';

import Dialog from './Dialog.jsx';
import DialogSection from './DialogSection.jsx';

const MSG = defineMessages({
  defaultHeading: {
    id: 'ConfirmDialog.defaultHeading',
    defaultMessage: 'Please confirm',
  },
  defaultText: {
    id: 'ConfirmDialog.defaultText',
    defaultMessage: 'Are you sure?',
  },
  defaultCancelButton: {
    id: 'ConfirmDialog.defaultCancelButton',
    defaultMessage: 'Cancel',
  },
  defaultConfirmButton: {
    id: 'ConfirmDialog.defaultConfirmButton',
    defaultMessage: 'OK',
  },
});

type Props = {
  cancel: () => void,
  close: (val: any) => void,
  heading?: string | MessageDescriptor,
  children?: Node,
  cancelButtonText?: string | MessageDescriptor,
  confirmButtonText?: string | MessageDescriptor,
};

const ConfirmDialog = ({
  cancel,
  close,
  // $FlowFixMe https://github.com/facebook/flow/issues/183#issuecomment-267274206
  heading = MSG.defaultHeading,
  // $FlowFixMe
  children,
  // $FlowFixMe
  cancelButtonText = MSG.defaultCancelButton,
  // $FlowFixMe
  confirmButtonText = MSG.defaultConfirmButton,
}: Props) => (
  <Dialog cancel={cancel}>
    <DialogSection>
      <Heading appearance={{ size: 'medium', margin: 'none' }} text={heading} />
    </DialogSection>
    <DialogSection>
      {children || <FormattedMessage {...MSG.defaultText} />}
    </DialogSection>
    <DialogSection appearance={{ align: 'right' }}>
      <Button
        appearance={{ theme: 'secondary', size: 'large' }}
        onClick={cancel}
        text={cancelButtonText}
      />
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        onClick={close}
        text={confirmButtonText}
      />
    </DialogSection>
  </Dialog>
);

export default ConfirmDialog;
