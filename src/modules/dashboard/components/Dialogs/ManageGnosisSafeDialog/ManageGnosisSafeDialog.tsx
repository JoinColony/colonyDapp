import React from 'react';
import { defineMessages } from 'react-intl';

import { DialogProps, ActionDialogProps } from '~core/Dialog';
import IndexModal from '~core/IndexModal';

import { WizardDialogType } from '~utils/hooks';

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
    id: 'dashboard.ManageReputationDialog.controlSafeTitle',
    defaultMessage: 'Control Safe',
  },
  controlSafeDescription: {
    id: 'dashboard.ManageGnosisSafeDialog.controlSafeDescription',
    defaultMessage: 'Get your colony’s Gnosis Safe to do stuff.',
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
  cancel,
  close,
  callStep,
  prevStep,
  nextStepAddExistingSafe,
  nextStepRemoveSafe,
  nextStepControlSafe,
}: Props) => {
  const items = [
    {
      title: MSG.addExistingSafeTitle,
      description: MSG.addExistingSafeDescription,
      icon: 'plus-heavy',
      dataTest: 'gnosisAddExistingItem',
      onClick: () => callStep(nextStepAddExistingSafe),
    },
    {
      title: MSG.removeSafeTitle,
      description: MSG.removeSafeDescription,
      icon: 'trash-can',
      dataTest: 'gnosisRemoveSafeItem',
      onClick: () => callStep(nextStepRemoveSafe),
    },
    {
      title: MSG.controlSafeTitle,
      description: MSG.controlSafeDescription,
      icon: 'joystick',
      dataTest: 'gnosisControlSafeItem',
      onClick: () => callStep(nextStepControlSafe),
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
