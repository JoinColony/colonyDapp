import React from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import { DialogProps, ActionDialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType, useTransformer } from '~utils/hooks';
import { useLoggedInUser, Colony } from '~data/index';

import { getAllUserRoles } from '../../../transformers';
import { userHasRole } from '../../../users/checks';

const MSG = defineMessages({
  dialogHeader: {
    id: 'dashboard.ManageReputationDialog.dialogHeader',
    defaultMessage: 'Manage Reputation',
  },
  awardReputationTitle: {
    id: 'dashboard.ManageReputationDialog.awardReputationTitle',
    defaultMessage: 'Award reputation',
  },
  awardReputationDescription: {
    id: 'dashboard.ManageReputationDialog.awardReputationDescription',
    defaultMessage: 'Award reputation without making payments.',
  },
  permissionText: {
    id: 'dashboard.ManageReputationDialog.permissionsText',
    defaultMessage: `You must have the arbitration permission in the
      relevant teams, in order to take this action`,
  },
  smiteReputationTitle: {
    id: 'dashboard.ManageReputationDialog.smiteReputationTitle',
    defaultMessage: 'Smite',
  },
  smiteReputationDescription: {
    id: 'dashboard.ManageReputationDialog.smiteReputationDescription',
    defaultMessage:
      'Punish undesirable behaviour by deducting Reputation points.',
  },
});

interface CustomWizardDialogProps extends ActionDialogProps {
  nextStepSmiteReputation: string;
  nextStepAwardReputation: string;
  prevStep: string;
  colony: Colony;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.ManageReputationDialog';

const ManageReputation = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  isVotingExtensionEnabled,
  nextStepSmiteReputation,
  nextStepAwardReputation,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canManageReputation =
    hasRegisteredProfile &&
    (userHasRole(allUserRoles, ColonyRole.Arbitration) ||
      isVotingExtensionEnabled);

  const items = [
    {
      title: MSG.awardReputationTitle,
      description: MSG.awardReputationDescription,
      icon: 'emoji-shooting-star',
      permissionRequired: !canManageReputation,
      permissionInfoText: MSG.permissionText,
      onClick: () => callStep(nextStepAwardReputation),
    },
    {
      title: MSG.smiteReputationTitle,
      description: MSG.smiteReputationDescription,
      icon: 'emoji-firebolt',
      permissionRequired: !canManageReputation,
      permissionInfoText: MSG.permissionText,
      onClick: () => callStep(nextStepSmiteReputation),
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

ManageReputation.displayName = displayName;

export default ManageReputation;
