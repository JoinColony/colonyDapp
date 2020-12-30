import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ConfirmDialog } from '~core/Dialog';

const MSG = defineMessages({
  title: {
    id: 'admin.RecoveryModeDialog.title',
    defaultMessage: 'Enter Recovery mode',
  },
  description1: {
    id: 'admin.RecoveryModeDialog.description1',
    defaultMessage: `If you believe that something dangerous is happening in
    your colony (e.g. it is under attack),recovery mode will disable the colony
    and prevent further activity undtil the issue has been overcome.`,
  },
  description2: {
    id: 'admin.RecoveryModeDialog.description2',
    defaultMessage: `
    Leaving recovery reuqires the approval of a majority of members
    holding the {roleRequires} permission`,
  },
  annotation: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.annotation',
    defaultMessage:
      'Explain why you’re putting this colony into recovery mode (optional)',
  },
});

const displayName = 'dashboard.RecoveryModeDialog';

interface Props {
  cancel: () => void;
  close: () => void;
}

const RecoveryModeDialog = ({ cancel, close }: Props) => (
  <ConfirmDialog
    appearance={{ theme: 'danger' }}
    cancel={cancel}
    close={close}
    heading={MSG.title}
    confirmButtonText="Confirm"
  >
    <FormattedMessage {...MSG.description1} />
  </ConfirmDialog>
);

RecoveryModeDialog.displayName = displayName;

export default RecoveryModeDialog;
