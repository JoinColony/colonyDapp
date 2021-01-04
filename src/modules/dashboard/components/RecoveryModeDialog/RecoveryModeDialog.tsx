import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';

const MSG = defineMessages({
  title: {
    id: 'admin.RecoveryModeDialog.title',
    defaultMessage: 'Enter Recovery mode',
  },
  description1: {
    id: 'admin.RecoveryModeDialog.description1',
    defaultMessage: `If you believe that something dangerous is happening in
    your colony (e.g. it is under attack),recovery mode will disable the colony
    and prevent further activity undtil the issue has been overcome.`,
  },
  description2: {
    id: 'admin.RecoveryModeDialog.description2',
    defaultMessage: `
    Leaving recovery reuqires the approval of a majority of members
    holding the {roleRequires} permission`,
  },
  annotation: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.annotation',
    defaultMessage:
      'Explain why you’re putting this colony into recovery mode (optional)',
  },
});

interface CustomWizardDialogProps {
  prevStep: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.RecoveryModeDialog';

const RecoveryModeDialog = ({ cancel, close }: Props) => {
  const validationSchema = yup.object().shape({
    annotation: yup.string().max(4000),
  });

  return (
    <ActionForm
      initialValues={{
        annotation: undefined,
      }}
      submit={ActionTypes.COLONY_RECOVERY_MODE_ENTER}
      error={ActionTypes.COLONY_RECOVERY_MODE_ENTER_ERROR}
      success={ActionTypes.COLONY_RECOVERY_MODE_ENTER_SUCCESS}
      validationSchema={validationSchema}
      onSuccess={close}
    >
      <Dialog cancel={cancel}>{MSG.title}</Dialog>
    </ActionForm>
  );
};

RecoveryModeDialog.displayName = displayName;

export default RecoveryModeDialog;
