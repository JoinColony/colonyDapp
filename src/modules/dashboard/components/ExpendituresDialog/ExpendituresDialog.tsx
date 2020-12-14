import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType, useTransformer } from '~utils/hooks';
import { useLoggedInUser, Colony } from '~data/index';
import { getAllUserRoles } from '../../../transformers';
import { canArchitect, canFund } from '../../../users/checks';

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

interface CustomWizardDialogProps {
  nextStep: string;
  prevStep: string;
  colony: Colony;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.ExpendituresDialog';

const ExpendituresDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  nextStep,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canCreatePayment =
    hasRegisteredProfile && canArchitect(allUserRoles) && canFund(allUserRoles);

  const items = [
    {
      title: MSG.paymentTitle,
      description: MSG.paymentDescription,
      icon: 'emoji-dollar-stack',
      permissionRequired: !canCreatePayment,
      permissionInfoText: MSG.paymentPermissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.paymentPermissionsList} />,
      },
      onClick: () => callStep(nextStep),
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
      back={() => callStep(prevStep)}
    />
  );
};

ExpendituresDialog.displayName = displayName;

export default ExpendituresDialog;
