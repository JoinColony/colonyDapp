import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import { DialogProps, ActionDialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType, useTransformer } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { useLoggedInUser, Colony } from '~data/index';

import { getAllUserRoles } from '~modules/transformers';
import { userHasRole } from '~modules/users/checks';

const MSG = defineMessages({
  dialogHeader: {
    id: 'dashboard.ManageReputationDialog.dialogHeader',
    defaultMessage: 'Manage Reputation',
  },
  awardReputationTitle: {
    id: 'dashboard.ManageReputationDialog.awardReputationTitle',
    defaultMessage: 'Award Reputation',
  },
  awardReputationDescription: {
    id: 'dashboard.ManageReputationDialog.awardReputationDescription',
    defaultMessage: 'Award reputation without making payments.',
  },
  permissionText: {
    id: 'dashboard.ManageReputationDialog.permissionsText',
    defaultMessage: `You must have the {permission} permission in the
      relevant teams, in order to take this action`,
  },
  smiteReputationTitle: {
    id: 'dashboard.ManageReputationDialog.smiteReputationTitle',
    defaultMessage: 'Smite Reputation',
  },
  smiteReputationDescription: {
    id: 'dashboard.ManageReputationDialog.smiteReputationDescription',
    defaultMessage:
      'Punish undesirable behaviour by deducting reputation points.',
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
  nextStepSmiteReputation,
  nextStepAwardReputation,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const { formatMessage } = useIntl();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const hasRegisteredProfile = !!username && !ethereal;
  const canSmiteReputation =
    hasRegisteredProfile &&
    (userHasRole(allUserRoles, ColonyRole.Arbitration) ||
      isVotingExtensionEnabled);

  const canAwardReputation =
    hasRegisteredProfile &&
    (userHasRole(allUserRoles, ColonyRole.Root) || isVotingExtensionEnabled);

  const items = [
    {
      title: MSG.awardReputationTitle,
      description: MSG.awardReputationDescription,
      icon: 'emoji-shooting-star',
      permissionRequired: !canAwardReputation,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permission: formatMessage({
          id: `role.${ColonyRole.Root}`,
        }).toLowerCase(),
      },
      onClick: () => callStep(nextStepAwardReputation),
      dataTest: 'awardReputationDialogIndexItem',
    },
    {
      title: MSG.smiteReputationTitle,
      description: MSG.smiteReputationDescription,
      icon: 'emoji-firebolt',
      permissionRequired: !canSmiteReputation,
      permissionInfoText: MSG.permissionText,
      permissionInfoTextValues: {
        permission: formatMessage({
          id: `role.${ColonyRole.Arbitration}`,
        }).toLowerCase(),
      },
      onClick: () => callStep(nextStepSmiteReputation),
      dataTest: 'smiteReputationDialogIndexItem',
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
