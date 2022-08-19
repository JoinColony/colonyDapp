import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { DialogProps, ActionDialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType, useTransformer } from '~utils/hooks';
import { useLoggedInUser } from '~data/index';
import { getAllUserRoles } from '~modules/transformers';
import { canFund, hasRoot } from '~modules/users/checks';

import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

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
    defaultMessage: 'Move funds between teams.',
  },
  permissionsListText: {
    id: 'dashboard.ManageFundsDialog.permissionsListText',
    defaultMessage: `You must have the {permissionsList} permissions in the
      relevant teams, in order to take this action`,
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
  mintTokensPermissionsList: {
    id: 'dashboard.ManageFundsDialog.mintTokensPermissionsList',
    defaultMessage: 'root',
  },
  manageTokensTitle: {
    id: 'dashboard.ManageFundsDialog.manageTokensTitle',
    defaultMessage: 'Manage Tokens',
  },
  manageTokensDescription: {
    id: 'dashboard.ManageFundsDialog.manageTokensDescription',
    defaultMessage: 'Add or remove tokens you want the colony to recognize.',
  },
  manageTokensPermissionsList: {
    id: 'dashboard.AdvancedDialog.manageTokensPermissionsList',
    defaultMessage: 'root',
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
  unlockTokensTitle: {
    id: 'dashboard.ManageFundsDialog.unlockTokensTitle',
    defaultMessage: 'Unlock Token',
  },
  unlockTokensDescription: {
    id: 'dashboard.ManageFundsDialog.unlockTokensDescription',
    defaultMessage:
      'Allow your native token to be transferred between accounts.',
  },
});

interface CustomWizardDialogProps extends ActionDialogProps {
  nextStepTransferFunds: string;
  nextStepMintTokens: string;
  nextStepManageTokens: string;
  nextStepUnlockToken: string;
  prevStep: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.ManageFundsDialog';

const ManageFundsDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  nextStepTransferFunds,
  nextStepMintTokens,
  nextStepManageTokens,
  nextStepUnlockToken,
}: Props) => {
  const { walletAddress } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const canMoveFunds = canFund(allUserRoles);
  const canUserMintNativeToken = isVotingExtensionEnabled
    ? colony.canColonyMintNativeToken
    : hasRoot(allUserRoles) && colony.canColonyMintNativeToken;
  const canUserUnlockNativeToken = isVotingExtensionEnabled
    ? colony.canColonyUnlockNativeToken
    : hasRoot(allUserRoles) && colony.canColonyUnlockNativeToken;

  const canManageTokens = hasRoot(allUserRoles);

  const items = [
    {
      title: MSG.transferFundsTitle,
      description: MSG.transferFundsDescription,
      icon: 'emoji-world-globe',
      permissionRequired: !(canMoveFunds || isVotingExtensionEnabled),
      permissionInfoText: MSG.permissionsListText,
      permissionInfoTextValues: {
        permissionsList: <FormattedMessage {...MSG.paymentPermissionsList} />,
      },
      onClick: () => callStep(nextStepTransferFunds),
      dataTest: 'transferFundsDialogIndexItem',
    },
    {
      title: MSG.mintTokensTitle,
      description: MSG.mintTokensDescription,
      icon: 'emoji-seed-sprout',
      permissionRequired: !canUserMintNativeToken,
      permissionInfoText: MSG.permissionsListText,
      permissionInfoTextValues: {
        permissionsList: (
          <FormattedMessage {...MSG.mintTokensPermissionsList} />
        ),
      },
      onClick: () => callStep(nextStepMintTokens),
      dataTest: 'mintTokensDialogItem',
    },
    {
      title: MSG.manageTokensTitle,
      description: MSG.manageTokensDescription,
      icon: 'emoji-pen',
      permissionRequired: !(canManageTokens || isVotingExtensionEnabled),
      permissionInfoText: MSG.permissionsListText,
      permissionInfoTextValues: {
        permissionsList: (
          <FormattedMessage {...MSG.manageTokensPermissionsList} />
        ),
      },
      onClick: () => callStep(nextStepManageTokens),
      dataTest: 'manageTokensDialogItem',
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
    {
      title: MSG.unlockTokensTitle,
      description: MSG.unlockTokensDescription,
      icon: 'emoji-padlock',
      onClick: () => callStep(nextStepUnlockToken),
      permissionRequired: !canUserUnlockNativeToken,
      permissionInfoText: MSG.permissionsListText,
      permissionInfoTextValues: {
        permissionsList: (
          <FormattedMessage {...MSG.manageTokensPermissionsList} />
        ),
      },
      dataTest: 'unlockTokenDialogIndexItem',
    },
  ];
  const filteredItems = useMemo(() => {
    return colony.canColonyMintNativeToken && colony.canColonyUnlockNativeToken
      ? items
      : items.filter(({ icon }) => {
          if (icon === 'emoji-padlock' && !colony.canColonyUnlockNativeToken) {
            return false;
          }
          return !(
            icon === 'emoji-seed-sprout' && !colony.canColonyMintNativeToken
          );
        });
  }, [colony, items]);
  return (
    <IndexModal
      cancel={cancel}
      close={close}
      title={MSG.dialogHeader}
      items={filteredItems}
      back={() => callStep(prevStep)}
    />
  );
};

ManageFundsDialog.displayName = displayName;

export default ManageFundsDialog;
