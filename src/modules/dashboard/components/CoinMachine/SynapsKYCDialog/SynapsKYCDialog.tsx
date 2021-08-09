import React, { useMemo } from 'react';

import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';


const MSG = defineMessages({
  buttonText: {
    id: 'dashboard.CoinMachine.SynapsKYCDialog.buttonText',
    defaultMessage: 'Proceed',
  },
});

const displayName = 'dashboard.CoinMachine.SynapsKYCDialog';

const SynapsKYCDialog = ({ cancel }: DialogProps) => {

  return (
    <Dialog cancel={cancel}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>

      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
            appearance={{ theme: 'primary', size: 'large' }}
            text={MSG.buttonText}
          />
      </DialogSection>
    </Dialog>
  );
};

SynapsKYCDialog.displayName = displayName;

export default SynapsKYCDialog;
