import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType, useTransformer } from '~utils/hooks';
import { useLoggedInUser, Colony } from '~data/index';
import { getAllUserRoles } from '../../../transformers';
import { canFund } from '../../../users/checks';

const MSG = defineMessages({
  dialogHeader: {
    id: 'dashboard.ManageFundsDialog.dialogHeader',
    defaultMessage: 'Manage Funds',
  },
  transferFundsTitle: {
    id: 'dashboard.ManageFundsDialog.transferFundsTitle',
    defaultMessage: 'Transfer Funds',
  },
  transferFundsDescription: {
    id: 'dashboard.ManageFundsDialog.transferFundsDescription',
    defaultMessage: 'Move funds between domais.',
  },
  moveFundsPermissionsText: {
    id: 'dashboard.ManageFundsDialog.moveFundsPermissionsText',
    defaultMessage: `You must have the {permissionsList} permissions in the
      relevant domains, in order to take this action`,
  },
  paymentPermissionsList: {
    id: 'dashboard.ManageFundsDialog.paymentPermissionsList',
    defaultMessage: 'funding',
  },
  mintTokensTitle: {
    id: 'dashboard.ManageFundsDialog.mintTokensTitle',
    defaultMessage: 'Mint Tokens',
  },
  mintTokensDescription: {
    id: 'dashboard.ManageFundsDialog.mintTokensDescription',
    defaultMessage: 'Need more tokens? Cook up a batch here.',
  },
  manageTokensTitle: {
    id: 'dashboard.ManageFundsDialog.manageTokensTitle',
    defaultMessage: 'Manage Tokens',
  },
  manageTokensDescription: {
    id: 'dashboard.ManageFundsDialog.manageTokensDescription',
    defaultMessage: 'Add or remove tokens you want the colony to recognize.',
  },
  rewardPayoutTitle: {
    id: 'dashboard.ManageFundsDialog.rewardPayoutTitle',
    defaultMessage: 'Start a Reward Payout',
  },
  rewardPayoutDescription: {
    id: 'dashboard.ManageFundsDialog.rewardPayoutDescription',
    defaultMessage:
      "Are there funds in your colony's reward pot? Make it rain!",
  },
  rewardsTitle: {
    id: 'dashboard.ManageFundsDialog.rewardsTitle',
    defaultMessage: 'Set Rewards',
  },
  rewardsDescription: {
    id: 'dashboard.ManageFundsDialog.rewardsDescription',
    defaultMessage: "Set what % of the colony's revenue should go to members.",
  },
});

interface CustomWizardDialogProps {
  nextStep: string;
  prevStep: string;
  colony: Colony;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.ManageFundsDialog';

const ManageFundsDialog = ({
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
  const canMoveFunds = hasRegisteredProfile && canFund(allUserRoles);

  const items = [
    {
      title: MSG.transferFundsTitle,
      description: MSG.transferFundsDescription,
      icon: 'emoji-world-globe',
      permissionRequired: !canMoveFunds,
      permissionInfoText: MSG.moveFundsPermissionsText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.paymentPermissionsList} />,
      },
      onClick: () => callStep(nextStep),
    },
    {
      title: MSG.mintTokensTitle,
      description: MSG.mintTokensDescription,
      icon: 'emoji-seed-sprout',
    },
    {
      title: MSG.manageTokensTitle,
      description: MSG.manageTokensDescription,
      icon: 'emoji-pen',
    },
    {
      title: MSG.rewardPayoutTitle,
      description: MSG.rewardPayoutDescription,
      icon: 'emoji-piggy-bank',
      comingSoon: true,
    },
    {
      title: MSG.rewardsTitle,
      description: MSG.rewardsDescription,
      icon: 'emoji-medal',
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

ManageFundsDialog.displayName = displayName;

export default ManageFundsDialog;
