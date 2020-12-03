import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ConfirmDialog } from '~core/Dialog';

const MSG = defineMessages({
  title: {
    id: 'dashboard.NetworkContractUpgradeDialog.title',
    defaultMessage: 'Upgrade Colony Contract Version',
  },
  description: {
    id: 'dashboard.NetworkContractUpgradeDialog.description',
    defaultMessage: `
      You are about to upgrade your Colony's contract to the latest version`,
  },
  upgradeButton: {
    id: 'dashboard.NetworkContractUpgradeDialog.upgradeButton',
    defaultMessage: 'Upgrade Contract Version',
  },
});

const displayName = 'dashboard.NetworkContractUpgradeDialog';

interface Props {
  cancel: () => void;
  close: () => void;
}

const NetworkContractUpgradeDialog = ({ cancel, close }: Props) => (
  <ConfirmDialog
    cancel={cancel}
    close={close}
    heading={MSG.title}
    confirmButtonText={MSG.upgradeButton}
  >
    <FormattedMessage {...MSG.description} />
  </ConfirmDialog>
);

NetworkContractUpgradeDialog.displayName = displayName;

export default NetworkContractUpgradeDialog;
