import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType } from '~utils/hooks';

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
  taskTitle: {
    id: 'dashboard.ExpendituresDialog.taskTitle',
    defaultMessage: 'Task',
  },
  taskDescription: {
    id: 'dashboard.ExpendituresDialog.taskDescription',
    defaultMessage: 'Commission some work and who will manage its delivery.',
  },
  recurringTitle: {
    id: 'dashboard.ExpendituresDialog.recurringTitle',
    defaultMessage: 'Task',
  },
  recurringDescription: {
    id: 'dashboard.ExpendituresDialog.recurringDescription',
    defaultMessage: 'For regular payments like salaries.',
  },
});

type Props = DialogProps & WizardDialogType<object>;

const displayName = 'dashboard.ExpendituresDialog';

const ExpendituresDialog = ({ cancel, close, callStep }: Props) => {
  const items = [
    {
      title: MSG.paymentTitle,
      description: MSG.paymentDescription,
      icon: 'emoji-dollar-stack',
      permissionRequired: true,
      permissionInfoText: MSG.paymentPermissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.paymentPermissionsList} />,
      },
    },
    {
      title: MSG.taskTitle,
      description: MSG.taskDescription,
      icon: 'emoji-superman',
      comingSoon: true,
      permissionRequired: true,
    },
    {
      title: MSG.recurringTitle,
      description: MSG.recurringDescription,
      icon: 'emoji-calendar',
      comingSoon: true,
    },
  ];
  return (
    <IndexModal
      cancel={cancel}
      close={close}
      title={MSG.dialogHeader}
      items={items}
      back={() => callStep('dashboard.ColonyActionsDialog')}
    />
  );
};

ExpendituresDialog.displayName = displayName;

export default ExpendituresDialog;
