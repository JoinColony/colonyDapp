import { ColonyRole } from '@colony/colony-js';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps, ActionDialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';
import { useLoggedInUser } from '~data/index';
import { getAllUserRoles } from '~modules/transformers';
import { userHasRole } from '~modules/users/checks';
import { useTransformer, WizardDialogType } from '~utils/hooks';

const MSG = defineMessages({
  dialogHeader: {
    id: 'dashboard.ManageGnosisSafeDialog.dialogHeader',
    defaultMessage: 'Gnosis Safe Control',
  },
  addExistingSafeTitle: {
    id: 'dashboard.ManageGnosisSafeDialog.addExistingSafeTitle',
    defaultMessage: 'Add Existing Safe',
  },
  addExistingSafeDescription: {
    id: 'dashboard.ManageGnosisSafeDialog.addExistingSafeDescription',
    defaultMessage:
      'Add an existing Gnosis Safe that you would like your Colony to control.',
  },
  removeSafeTitle: {
    id: 'dashboard.ManageGnosisSafeDialog.removeSafeTitle',
    defaultMessage: 'Remove Safe',
  },
  removeSafeDescription: {
    id: 'dashboard.ManageGnosisSafeDialog.removeSafeDescription',
    defaultMessage: 'Remove a Gnosis Safe you previously added to your Colony.',
  },
  controlSafeTitle: {
    id: 'dashboard.ManageGnosisSafeDialog.controlSafeTitle',
    defaultMessage: 'Control Safe',
  },
  controlSafeDescription: {
    id: 'dashboard.ManageGnosisSafeDialog.controlSafeDescription',
    defaultMessage: 'Get your colony’s Gnosis Safe to do stuff.',
  },
  permissionText: {
    id: 'dashboard.ManageGnosisSafeDialog.permissionsText',
    defaultMessage: `You must have the {permissionsList} permissions in the
      relevant teams, in order to take this action`,
  },
  adminFundingPermissions: {
    id: 'dashboard.ManageGnosisSafeDialog.adminFundingPermissions',
    defaultMessage: 'administration and funding ',
  },
  rootFundingPermissions: {
    id: 'dashboard.ManageGnosisSafeDialog.rootFundingPermissions',
    defaultMessage: 'root and funding ',
  },
});

interface CustomWizardDialogProps extends ActionDialogProps {
  nextStepAddExistingSafe: string;
  nextStepRemoveSafe: string;
  nextStepControlSafe: string;
  prevStep: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.ManageGnosisSafeDialog';

const ManageGnosisSafeDialog = ({
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
  const canAddRemoveSafes =
    hasRegisteredProfile &&
    userHasRole(allUserRoles, ColonyRole.Administration) &&
    userHasRole(allUserRoles, ColonyRole.Funding);

  const canControlSafes =
    hasRegisteredProfile &&
    userHasRole(allUserRoles, ColonyRole.Root) &&
    userHasRole(allUserRoles, ColonyRole.Funding);

  const items = [
    {
      title: MSG.addExistingSafeTitle,
      description: MSG.addExistingSafeDescription,
      icon: 'plus-heavy',
      dataTest: 'gnosisAddExistingItem',
      onClick: () => callStep(nextStepAddExistingSafe),
      permissionRequired: !canAddRemoveSafes,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.adminFundingPermissions} />,
      },
    },
    {
      title: MSG.removeSafeTitle,
      description: MSG.removeSafeDescription,
      icon: 'trash-can',
      dataTest: 'gnosisRemoveSafeItem',
      onClick: () => callStep(nextStepRemoveSafe),
      permissionRequired: !canAddRemoveSafes,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.adminFundingPermissions} />,
      },
    },
    {
      title: MSG.controlSafeTitle,
      description: MSG.controlSafeDescription,
      icon: 'joystick',
      dataTest: 'gnosisControlSafeItem',
      onClick: () => callStep(nextStepControlSafe),
      permissionRequired: !canControlSafes,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.rootFundingPermissions} />,
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

ManageGnosisSafeDialog.displayName = displayName;

export default ManageGnosisSafeDialog;
