import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ConfirmDialog } from '~core/Dialog';

const MSG = defineMessages({
  title: {
    id: 'admin.UpgradeContractDialog.title',
    defaultMessage: 'Upgrade Colony Contract Version',
  },
  description: {
    id: 'admin.UpgradeContractDialog.description',
    defaultMessage: `
      You are about to upgrade your Colony's contract to the latest version`,
  },
  upgradeButton: {
    id: 'admin.UpgradeContractDialog.upgradeButton',
    defaultMessage: 'Upgrade Contract Version',
  },
});

const displayName = 'admin.UpgradeContractDialog';

interface Props {
  cancel: () => void;
  close: () => void;
}

const UpgradeContractDialog = ({ cancel, close }: Props) => (
  <ConfirmDialog
    cancel={cancel}
    close={close}
    heading={MSG.title}
    confirmButtonText={MSG.upgradeButton}
  >
    <FormattedMessage {...MSG.description} />
  </ConfirmDialog>
);

UpgradeContractDialog.displayName = displayName;

export default UpgradeContractDialog;
