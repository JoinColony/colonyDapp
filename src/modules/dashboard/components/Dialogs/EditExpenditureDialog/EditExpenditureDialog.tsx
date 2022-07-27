import React, { useCallback, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as yup from 'yup';

import { FormikProps } from 'formik';
import { ActionTypes } from '~redux/actionTypes';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import { Colony } from '~data/index';
import EditExpenditureDialogForm from './EditExpenditureDialogForm';
import { ActionForm } from '~core/Fields';

export const MSG = defineMessages({
  header: {
    id: 'dashboard.EditExpenditureDialog.header',
    defaultMessage: 'Create a motion to edit payment',
  },
  descriptionText: {
    id: 'dashboard.EditExpenditureDialog.descriptionText',
    defaultMessage: `Payment is currently at the locked stage.
    Any edits require at this point an action to be made.
    You can either enforce permission,
    or create a motion to get collective approval.`,
  },
  newRecipient: {
    id: 'dashboard.EditExpenditureDialog.newRecipient',
    defaultMessage: 'New recipient',
  },
  newAmount: {
    id: 'dashboard.EditExpenditureDialog.newAmount',
    defaultMessage: 'New amount',
  },
  newClaimDelay: {
    id: 'dashboard.EditExpenditureDialog.newClaimDelay',
    defaultMessage: 'New claim delay',
  },
  descriptionLabel: {
    id: 'dashboard.EditExpenditureDialog.descriptionLabel',
    defaultMessage: `Explain why you're changing the payment (optional)`,
  },
  cancelText: {
    id: 'dashboard.EditExpenditureDialog.cancelText',
    defaultMessage: 'Back',
  },
  confirmText: {
    id: 'dashboard.EditExpenditureDialog.confirmText',
    defaultMessage: 'Create Motion',
  },
  confirmTexForce: {
    id: 'dashboard.EditExpenditureDialog.confirmTexForce',
    defaultMessage: 'Force change',
  },
  forceTextareaLabel: {
    id: 'dashboard.EditExpenditureDialog.textareaLabel',
    defaultMessage: `Explain why you're changing the expenditure`,
  },
  errorAnnotation: {
    id: 'dashboard.EditExpenditureDialog.errorAnnotation',
    defaultMessage: 'Annotation is required',
  },
  change: {
    id: 'dashboard.EditExpenditureDialog.change',
    defaultMessage: 'Change',
  },
  new: {
    id: 'dashboard.EditExpenditureDialog.new',
    defaultMessage: 'New',
  },
  discard: {
    id: 'dashboard.EditExpenditureDialog.discard',
    defaultMessage: 'Discard',
  },
  removed: {
    id: 'dashboard.EditExpenditureDialog.removed',
    defaultMessage: 'Recipient has been deleted',
  },
  removedDelay: {
    id: 'dashboard.EditExpenditureDialog.removedDelay',
    defaultMessage: 'Removed claim delay',
  },
  teamCaption: {
    id: 'dashboard.EditExpenditureDialog.teamCaption',
    defaultMessage: 'Team',
  },
  noChanges: {
    id: 'dashboard.EditExpenditureDialog.noChanges',
    defaultMessage: 'No values have been changed!',
  },
});

export const validationSchema = (annotationErrorMessage) =>
  yup.object().shape({
    forceAction: yup.bool(),
    // eslint-disable-next-line func-names
    annotationMessage: yup
      .string()
      .test('isRequired', annotationErrorMessage, function (value) {
        const isRequired = this?.parent?.forceAction;
        if (isRequired) {
          return !!value;
        }
        return true;
      }),
  });

export interface FormValuesType {
  forceAction: boolean;
  annotation?: string;
}

type Props = {
  onSubmitClick: (
    values: Partial<ValuesType> | undefined,
    wasForced: boolean,
  ) => void;
  close: () => void;
  isVotingExtensionEnabled: boolean;
  colony: Colony;
  newValues?: Partial<ValuesType>;
  oldValues: ValuesType;
};

const EditExpenditureDialog = ({
  close,
  onSubmitClick,
  isVotingExtensionEnabled,
  colony,
  newValues,
  oldValues,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const [domainID, setDomainID] = useState<number>();
  const [confirmedValues, setConfirmedValues] = useState(newValues);
  const { formatMessage } = useIntl();

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setDomainID(motionDomainId),
    [],
  );

  const discardChange = useCallback(
    (name: keyof ValuesType) => {
      if (confirmedValues && !(name in confirmedValues)) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name]: removedProperty, ...updatedValues } =
        confirmedValues || {};

      setConfirmedValues(updatedValues);
    },
    [confirmedValues],
  );

  const discardRecipientChange = useCallback((id: string) => {
    setConfirmedValues((confirmedVal) => {
      const newRecipients = confirmedVal?.recipients?.filter(
        (recipient) => recipient.id !== id,
      );

      if (newRecipients?.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { recipients: rec, ...updatedValues } = confirmedVal || {};

        return updatedValues;
      }
      const newVal = {
        ...confirmedVal,
        recipients: newRecipients,
      };

      return newVal;
    });
  }, []);

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  return (
    <ActionForm
      initialValues={{ forceAction: false }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
      validationSchema={validationSchema(formatMessage(MSG.errorAnnotation))}
    >
      {(formValues: FormikProps<FormValuesType>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <EditExpenditureDialogForm
            {...{
              close,
              handleMotionDomainChange,
              colony,
              confirmedValues,
              discardChange,
              discardRecipientChange,
              oldValues,
              onSubmitClick,
              domainID,
              isVotingExtensionEnabled,
              ...formValues,
            }}
          />
        );
      }}
    </ActionForm>
  );
};

export default EditExpenditureDialog;
