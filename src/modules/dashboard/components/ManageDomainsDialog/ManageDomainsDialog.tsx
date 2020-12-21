import React from 'react';
import { defineMessages } from 'react-intl';

import { DialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType } from '~utils/hooks';

const MSG = defineMessages({
  dialogHeader: {
    id: 'dashboard.ManageDomainsDialog.dialogHeader',
    defaultMessage: 'Manage domains',
  },
  createNewDomainTitle: {
    id: 'dashboard.ManageDomainsDialog.createNewDomainTitle',
    defaultMessage: 'Create new domain',
  },
  createNewDomainDescription: {
    id: 'dashboard.ManageDomainsDialog.createNewDomainDescription',
    defaultMessage:
      'Teams, departments, circles: domains let you froup types of activity.',
  },
  editDomainTitle: {
    id: 'dashboard.ManageDomainsDialog.editDomainTitle',
    defaultMessage: 'Edit domain',
  },
  editDomainDescription: {
    id: 'dashboard.ManageDomainsDialog.editDomainDescription',
    defaultMessage: `Need to repurpose domain? Here's the place to do it.`,
  },
});

interface CustomWizardDialogueProps {
  nextStep: string;
  prevStep: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogueProps;

const displayName = 'dashboard.ManageDomainsDialog';

const ManageDomainsDialog = ({ cancel, close, callStep, prevStep }: Props) => {
  const items = [
    {
      title: MSG.createNewDomainTitle,
      description: MSG.createNewDomainDescription,
      icon: 'emoji-crane',
    },
    {
      title: MSG.editDomainTitle,
      description: MSG.editDomainDescription,
      icon: 'pencil-note',
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
