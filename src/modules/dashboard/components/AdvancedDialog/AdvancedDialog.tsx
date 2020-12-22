import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType, useTransformer } from '~utils/hooks';
import { useLoggedInUser, Colony } from '~data/index';
import { getAllUserRoles } from '../../../transformers';
import { hasRoot } from '../../../users/checks';

const MSG = defineMessages({
  dialogHeader: {
    id: 'dashboard.AdvancedDialog.dialogHeader',
    defaultMessage: 'Advanced',
  },
  permissionsText: {
    id: 'dashboard.AdvancedDialog.permissionsText',
    defaultMessage: `You must have the {permissionsList} permissions in the
      relevant domains, in order to take this action`,
  },
  managePermissionsTitle: {
    id: 'dashboard.AdvancedDialog.managePermissionsTitle',
    defaultMessage: 'Manage Permissions',
  },
  managePermissionsDescription: {
    id: 'dashboard.AdvancedDialog.managePermissionsDescription',
    defaultMessage: 'Set permissions for trusted colony members. Use with caution!',
  },
  recoveryTitle: {
    id: 'dashboard.AdvancedDialog.recoveryTitle',
    defaultMessage: 'Recovery',
  },
  recoveryDescription: {
    id: 'dashboard.AdvancedDialog.recoveryDescription',
    defaultMessage: 'Disable your colony in case of emergency.',
  },
  upgradeTitle: {
    id: 'dashboard.AdvancedDialog.upgradeTitle',
    defaultMessage: 'Upgrade',
  },
  upgradeDescription: {
    id: 'dashboard.AdvancedDialog.upgradeDescription',
    defaultMessage: 'New colony network version available? Get your colony’s swole on here.',
  },
  upgradePermissionsList: {
    id: 'dashboard.AdvancedDialog.upgradePermissionsList',
    defaultMessage: 'root',
  },
  editColonyDetailsTitle: {
    id: 'dashboard.AdvancedDialog.editColonyDetailsTitle',
    defaultMessage: 'Edit colony details',
  },
  editColonyDetailsDescription: {
    id: 'dashboard.AdvancedDialog.editColonyDetailsDescription',
    defaultMessage:
      "Change your colony’s logo and name here.",
  },
  makeArbitraryTransactionTitle: {
    id: 'dashboard.AdvancedDialog.makeArbitraryTransactionTitle',
    defaultMessage: 'Make arbitrary transaction',
  },
  makeArbitraryTransactionDescription: {
    id: 'dashboard.AdvancedDialog.makeArbitraryTransactionDescription',
    defaultMessage: "Want to interact with DeFi, or govern an external smart contract?",
  },
});

interface CustomWizardDialogProps {
  nextStep: string;
  prevStep: string;
  colony: Colony;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.AdvancedDialog';

const AdvancedDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  nextStep,
}: Props) => {
  const { walletAddress } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const canUpgradeVersion = hasRoot(allUserRoles);

  const items = [
    {
      title: MSG.managePermissionsTitle,
      description: MSG.managePermissionsDescription,
      icon: 'emoji-building',
      onClick: () => callStep(nextStep),
    },
    {
      title: MSG.recoveryTitle,
      description: MSG.recoveryDescription,
      icon: 'emoji-alarm-lamp',
    },
    {
      title: MSG.upgradeTitle,
      description: MSG.upgradeDescription,
      icon: 'emoji-strong-person',
      permissionRequired: !canUpgradeVersion,
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.upgradePermissionsList} />,
      },
    },
    {
      title: MSG.editColonyDetailsTitle,
      description: MSG.editColonyDetailsDescription,
      icon: 'emoji-edit-tools',
    },
    {
      title: MSG.makeArbitraryTransactionTitle,
      description: MSG.makeArbitraryTransactionDescription,
      icon: 'emoji-dna',
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

AdvancedDialog.displayName = displayName;

export default AdvancedDialog;
