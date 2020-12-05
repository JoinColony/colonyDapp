import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

const MSG = defineMessages({
  dialogHeader: {
    id: 'dashboard.ExpendituresDialog.dialogHeader',
    defaultMessage: 'Create Expenditure',
  },
  paymentTitle: {
    id: 'dashboard.ExpendituresDialog.paymentTitle',
    defaultMessage: 'Payment',
  },
  paymentDescription: {
    id: 'dashboard.ExpendituresDialog.paymentDescription',
    defaultMessage: 'A quick and simple payment for something already done.',
  },
  paymentPermissionsText: {
    id: 'dashboard.ExpendituresDialog.paymentPermissionsText',
    defaultMessage: `You must have the {permissionsList} permissions in the
      relevant domains, in order to take this action`,
  },
  paymentPermissionsList: {
    id: 'dashboard.ExpendituresDialog.paymentPermissionsList',
    defaultMessage: 'administration and funding',
  },
});

const displayName = 'dashboard.ExpendituresDialog';

const ExpendituresDialog = ({ cancel, close }: DialogProps) => {
  const items = [
    {
      title: MSG.paymentTitle,
      description: MSG.paymentDescription,
      icon: 'emoji-bag-money-sign',
      permissionRequired: true,
      permissionInfoText: MSG.paymentPermissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.paymentPermissionsList} />,
      },
    },
    {
      title: MSG.paymentTitle,
      description: MSG.paymentDescription,
      icon: 'emoji-bag-money-sign',
      comingSoon: true,
      permissionRequired: true,
    },
    {
      title: MSG.paymentTitle,
      description: MSG.paymentDescription,
      icon: 'emoji-bag-money-sign',
      comingSoon: true,
    },
  ];
  return (
    <IndexModal
      cancel={cancel}
      close={close}
      title={MSG.dialogHeader}
      items={items}
    />
  );
};

ExpendituresDialog.displayName = displayName;

export default ExpendituresDialog;
