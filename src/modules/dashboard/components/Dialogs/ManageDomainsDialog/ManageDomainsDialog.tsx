import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { DialogProps, ActionDialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { Colony, useLoggedInUser } from '~data/index';
import { WizardDialogType, useTransformer } from '~utils/hooks';

import { getAllUserRoles } from '~modules/transformers';
import { canArchitect } from '~modules/users/checks';

const MSG = defineMessages({
  dialogHeader: {
    id: 'dashboard.ManageDomainsDialog.dialogHeader',
    defaultMessage: 'Manage teams',
  },
  createNewDomainTitle: {
    id: 'dashboard.ManageDomainsDialog.createNewDomainTitle',
    defaultMessage: 'Create new team',
  },
  createNewDomainDescription: {
    id: 'dashboard.ManageDomainsDialog.createNewDomainDescription',
    defaultMessage:
      'Domains, departments, circles: teams let you group types of activity.',
  },
  editDomainTitle: {
    id: 'dashboard.ManageDomainsDialog.editDomainTitle',
    defaultMessage: 'Edit team',
  },
  editDomainDescription: {
    id: 'dashboard.ManageDomainsDialog.editDomainDescription',
    defaultMessage: `Need to repurpose a team? Here's the place to do it.`,
  },
  domainPermissionsList: {
    id: 'dashboard.ManageDomainsDialog.domainPermissionsList',
    defaultMessage: 'administration',
  },
});

interface CustomWizardDialogueProps extends ActionDialogProps {
  nextStep: string;
  nextStepEdit: string;
  prevStep: string;
  colony: Colony;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogueProps;

const displayName = 'dashboard.ManageDomainsDialog';

const ManageDomainsDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  nextStep,
  nextStepEdit,
  colony,
  isVotingExtensionEnabled,
}: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canCreateEditDomain =
    hasRegisteredProfile && canArchitect(allUserRoles);

  const items = [
    {
      title: MSG.createNewDomainTitle,
      description: MSG.createNewDomainDescription,
      icon: 'emoji-crane',
      permissionRequired: !(canCreateEditDomain || isVotingExtensionEnabled),
      permissionInfoTextValues: {
        permissionRequired: <FormattedMessage {...MSG.domainPermissionsList} />,
      },
      onClick: () => callStep(nextStep),
    },
    {
      title: MSG.editDomainTitle,
      description: MSG.editDomainDescription,
      icon: 'emoji-pencil-note',
      permissionRequired: !(canCreateEditDomain || isVotingExtensionEnabled),
      permissionInfoTextValues: {
        permissionRequired: <FormattedMessage {...MSG.domainPermissionsList} />,
      },
      onClick: () => callStep(nextStepEdit),
    },
  ];

  return (
    <IndexModal
      title={MSG.dialogHeader}
      cancel={cancel}
      close={close}
      items={items}
      back={() => callStep(prevStep)}
    />
  );
};

ManageDomainsDialog.displayName = displayName;

export default ManageDomainsDialog;
