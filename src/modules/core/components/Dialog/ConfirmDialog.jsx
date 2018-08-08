/* @flow */

import React from 'react';

import Dialog from './Dialog.jsx';
import DialogSection from './DialogSection.jsx';
import Heading from '../Heading';
import Button from '../Button';

type Props = {
  cancel: () => void,
  close: (val: any) => void,
};

const ConfirmDialog = ({ cancel, close }: Props) => (
  <Dialog cancel={cancel}>
    <DialogSection>
      <Heading appearance={{ size: 'medium', margin: 'none' }}>
        Enter Passphrase
      </Heading>
    </DialogSection>
    <DialogSection>Do you confirm this action?</DialogSection>
    <DialogSection appearance={{ align: 'right' }}>
      <Button
        appearance={{ theme: 'secondary', size: 'large' }}
        onClick={cancel}
      >
        Cancel
      </Button>
      <Button appearance={{ theme: 'primary', size: 'large' }} onClick={close}>
        Confirm
      </Button>
    </DialogSection>
  </Dialog>
);

export default ConfirmDialog;
