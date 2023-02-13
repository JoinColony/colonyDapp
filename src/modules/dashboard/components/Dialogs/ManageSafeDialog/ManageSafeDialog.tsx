import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps, ActionDialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';
import { useLoggedInUser } from '~data/index';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';
import { useTransformer, WizardDialogType } from '~utils/hooks';

const MSG = defineMessages({
  dialogHeader: {
    id: 'dashboard.ManageSafeDialog.dialogHeader',
    defaultMessage: 'Safe (multi-sig) Control',
  },
  addExistingSafeTitle: {
    id: 'dashboard.ManageSafeDialog.addExistingSafeTitle',
    defaultMessage: 'Add Existing Safe',
  },
  addExistingSafeDescription: {
    id: 'dashboard.ManageSafeDialog.addExistingSafeDescription',
    defaultMessage:
      'Add an existing Safe that you would like your Colony to control.',
  },
  removeSafeTitle: {
    id: 'dashboard.ManageSafeDialog.removeSafeTitle',
    defaultMessage: 'Remove Safe',
  },
  removeSafeDescription: {
    id: 'dashboard.ManageSafeDialog.removeSafeDescription',
    defaultMessage: 'Remove a Safe you previously added to your Colony.',
  },
  controlSafeTitle: {
    id: 'dashboard.ManageSafeDialog.controlSafeTitle',
    defaultMessage: 'Control Safe',
  },
  controlSafeDescription: {
    id: 'dashboard.ManageSafeDialog.controlSafeDescription',
    defaultMessage: 'Get your colony’s Safe to do stuff.',
  },
  permissionText: {
    id: 'dashboard.ManageSafeDialog.permissionsText',
    defaultMessage: `You must have the {permission} permission in the
      relevant teams, in order to take this action`,
  },
  manageSafePermission: {
    id: 'dashboard.ManageSafeDialog.manageSafePermission',
    defaultMessage: 'root',
  },
});

interface CustomWizardDialogProps extends ActionDialogProps {
  nextStepAddExistingSafe: string;
  nextStepRemoveSafe: string;
  nextStepControlSafe: string;
  prevStep: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.ManageSafeDialog';

const ManageSafeDialog = ({
  colony,
  cancel,
  close,
  callStep,
  prevStep,
  nextStepAddExistingSafe,
  nextStepRemoveSafe,
  nextStepControlSafe,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canManageAndControlSafes =
    hasRegisteredProfile && hasRoot(allUserRoles);

  const items = [
    {
      title: MSG.addExistingSafeTitle,
      description: MSG.addExistingSafeDescription,
      icon: 'plus-heavy',
      dataTest: 'addExistingSafeItem',
      onClick: () => callStep(nextStepAddExistingSafe),
      permissionRequired: !canManageAndControlSafes,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permission: <FormattedMessage {...MSG.manageSafePermission} />,
      },
    },
    {
      title: MSG.removeSafeTitle,
      description: MSG.removeSafeDescription,
      icon: 'trash-can',
      dataTest: 'removeSafeItem',
      onClick: () => callStep(nextStepRemoveSafe),
      permissionRequired: !canManageAndControlSafes,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permission: <FormattedMessage {...MSG.manageSafePermission} />,
      },
    },
    {
      title: MSG.controlSafeTitle,
      description: MSG.controlSafeDescription,
      icon: 'joystick',
      dataTest: 'controlSafeItem',
      onClick: () => callStep(nextStepControlSafe),
      permissionRequired: !canManageAndControlSafes,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permission: <FormattedMessage {...MSG.manageSafePermission} />,
      },
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

ManageSafeDialog.displayName = displayName;

export default ManageSafeDialog;
