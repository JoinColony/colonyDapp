import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType, useTransformer } from '~utils/hooks';
import { useLoggedInUser, Colony, useNetworkContracts } from '~data/index';

import { getAllUserRoles } from '../../../transformers';
import { canEnterRecoveryMode, hasRoot } from '../../../users/checks';

const MSG = defineMessages({
  dialogHeader: {
    id: 'dashboard.AdvancedDialog.dialogHeader',
    defaultMessage: 'Advanced',
  },
  permissionsText: {
    id: 'dashboard.AdvancedDialog.permissionsText',
    defaultMessage: `You must have the {permissionsList} permissions in the
      relevant teams, in order to take this action`,
  },
  managePermissionsTitle: {
    id: 'dashboard.AdvancedDialog.managePermissionsTitle',
    defaultMessage: 'Manage Permissions',
  },
  managePermissionsDescription: {
    id: 'dashboard.AdvancedDialog.managePermissionsDescription',
    defaultMessage:
      'Set permissions for trusted colony members. Use with caution!',
  },
  recoveryTitle: {
    id: 'dashboard.AdvancedDialog.recoveryTitle',
    defaultMessage: 'Recovery',
  },
  recoveryDescription: {
    id: 'dashboard.AdvancedDialog.recoveryDescription',
    defaultMessage: 'Disable your colony in case of emergency.',
  },
  recoveryPermissionsList: {
    id: 'dashboard.AdvancedDialog.recoveryPermissionsList',
    defaultMessage: 'recovery',
  },
  upgradeTitle: {
    id: 'dashboard.AdvancedDialog.upgradeTitle',
    defaultMessage: 'Upgrade',
  },
  upgradeDescription: {
    id: 'dashboard.AdvancedDialog.upgradeDescription',
    defaultMessage:
      'New colony network version available? Get your colony’s swole on here.',
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
    defaultMessage: 'Change your colony’s logo and name here.',
  },
  makeArbitraryTransactionTitle: {
    id: 'dashboard.AdvancedDialog.makeArbitraryTransactionTitle',
    defaultMessage: 'Make arbitrary transaction',
  },
  makeArbitraryTransactionDescription: {
    id: 'dashboard.AdvancedDialog.makeArbitraryTransactionDescription',
    defaultMessage:
      'Want to interact with DeFi, or govern an external smart contract?',
  },
});

interface CustomWizardDialogProps {
  nextStepRecovery: string;
  nextStepEditDetails: string;
  nextStepVersionUpgrade: string;
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
  nextStepRecovery,
  nextStepEditDetails,
  nextStepVersionUpgrade,
  colony,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const hasRegisteredProfile = !!username && !ethereal;

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const hasRootPermission = hasRegisteredProfile && hasRoot(allUserRoles);

  const canEnterRecovery =
    hasRegisteredProfile && canEnterRecoveryMode(allUserRoles);
  const { version: networkVersion } = useNetworkContracts();

  const canUpgradeVersion = hasRegisteredProfile && hasRoot(allUserRoles);

  const items = [
    {
      title: MSG.managePermissionsTitle,
      description: MSG.managePermissionsDescription,
      icon: 'emoji-building',
    },
    {
      title: MSG.recoveryTitle,
      description: MSG.recoveryDescription,
      icon: 'emoji-alarm-lamp',
      onClick: () => callStep(nextStepRecovery),
      permissionRequired: !canEnterRecovery,
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.recoveryPermissionsList} />,
      },
    },
    {
      title: MSG.upgradeTitle,
      description: MSG.upgradeDescription,
      icon: 'emoji-strong-person',
      permissionRequired: !hasRootPermission,
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.upgradePermissionsList} />,
      },
      onClick: () => callStep(nextStepVersionUpgrade),
    },
    {
      title: MSG.editColonyDetailsTitle,
      description: MSG.editColonyDetailsDescription,
      icon: 'emoji-edit-tools',
      permissionRequired: !canUpgradeVersion,
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.upgradePermissionsList} />,
      },
      onClick: () => callStep(nextStepEditDetails),
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
