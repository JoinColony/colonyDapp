import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyVersion } from '@colony/colony-js';

import { DialogProps, ActionDialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType, useTransformer } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { useLoggedInUser, Colony } from '~data/index';
import { getAllUserRoles } from '~modules/transformers';
import {
  canEnterRecoveryMode,
  hasRoot,
  canArchitect,
} from '~modules/users/checks';

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
  managePermissionsPermissionList: {
    id: 'dashboard.AdvancedDialog.managePermissionsPermissionList',
    defaultMessage: 'architecture',
  },
  recoveryTitle: {
    id: 'dashboard.AdvancedDialog.recoveryTitle',
    defaultMessage: 'Recovery',
  },
  recoveryDescription: {
    id: 'dashboard.AdvancedDialog.recoveryDescription',
    defaultMessage: 'Disable your colony in case of emergency.',
  },
  recoveryPreventDescription: {
    id: 'dashboard.AdvancedDialog.recoveryPreventDescription',
    defaultMessage: 'Please upgrade your colony version to use Recovery Mode.',
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

interface CustomWizardDialogProps extends ActionDialogProps {
  nextStepPermissionManagement: string;
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
  nextStepPermissionManagement,
  nextStepRecovery,
  nextStepEditDetails,
  nextStepVersionUpgrade,
  colony,
  colony: { version: colonyVersion },
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const hasRegisteredProfile = !!username && !ethereal;

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const hasRootPermission = hasRegisteredProfile && hasRoot(allUserRoles);

  const canEnterRecovery =
    hasRegisteredProfile && canEnterRecoveryMode(allUserRoles);
  const isSupportedColonyVersion =
    parseInt(colonyVersion, 10) > ColonyVersion.LightweightSpaceship;

  const canEnterPermissionManagement =
    (hasRegisteredProfile && canArchitect(allUserRoles)) || hasRootPermission;

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const items = [
    {
      title: MSG.managePermissionsTitle,
      description: MSG.managePermissionsDescription,
      icon: 'emoji-building',
      onClick: () => callStep(nextStepPermissionManagement),
      permissionRequired: !(
        canEnterPermissionManagement || isVotingExtensionEnabled
      ),
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permissionsList: (
          <FormattedMessage {...MSG.managePermissionsPermissionList} />
        ),
      },
      dataTest: 'managePermissionsDialogIndexItem',
    },
    {
      title: MSG.recoveryTitle,
      description: isSupportedColonyVersion
        ? MSG.recoveryDescription
        : MSG.recoveryPreventDescription,
      icon: 'emoji-alarm-lamp',
      onClick: () => callStep(nextStepRecovery),
      permissionRequired: !canEnterRecovery,
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.recoveryPermissionsList} />,
      },
      disabled: !isSupportedColonyVersion,
      dataTest: 'recoveryDialogIndexItem',
    },
    {
      title: MSG.upgradeTitle,
      description: MSG.upgradeDescription,
      icon: 'emoji-strong-person',
      permissionRequired: !(hasRootPermission || isVotingExtensionEnabled),
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
      permissionRequired: !(hasRootPermission || isVotingExtensionEnabled),
      permissionInfoText: MSG.permissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.upgradePermissionsList} />,
      },
      onClick: () => callStep(nextStepEditDetails),
      dataTest: 'updateColonyDialogIndexItem',
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
