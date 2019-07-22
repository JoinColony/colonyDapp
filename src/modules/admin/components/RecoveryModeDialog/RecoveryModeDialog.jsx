/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ConfirmDialog } from '~core/Dialog';

const MSG = defineMessages({
  title: {
    id: 'admin.RecoveryModeDialog.title',
    defaultMessage: 'Warning!',
  },
  description: {
    id: 'admin.RecoveryModeDialog.description',
    defaultMessage: `
      Your Colony will be disabled and all users will be unable to interact
      with your Colony. Exiting Recovery mode requires you to interact directly
      with the contracts. This is an advanced feature and should only be used
      in emergencies.`,
  },
  recoveryModeButton: {
    id: 'admin.RecoveryModeDialog.recoveryModeButton',
    defaultMessage: 'Enter Recovery mode',
  },
});

const displayName = 'admin.RecoveryModeDialog';

type Props = {
  cancel: () => void,
  close: () => void,
};

const RecoveryModeDialog = ({ cancel, close }: Props) => (
  <ConfirmDialog
    appearance={{ theme: 'danger' }}
    cancel={cancel}
    close={close}
    heading={MSG.title}
    confirmButtonText={MSG.recoveryModeButton}
  >
    <FormattedMessage {...MSG.description} />
  </ConfirmDialog>
);

RecoveryModeDialog.displayName = displayName;

export default RecoveryModeDialog;
