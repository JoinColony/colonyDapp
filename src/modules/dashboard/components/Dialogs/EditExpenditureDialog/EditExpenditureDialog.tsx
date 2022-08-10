import React, { useCallback, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as yup from 'yup';
import { FormikProps } from 'formik';

import { ValuesType } from '~pages/ExpenditurePage/types';
import { ActionForm } from '~core/Fields';
import Dialog from '~core/Dialog';
import { Colony } from '~data/index';
import { ActionTypes } from '~redux/actionTypes';

import EditExpenditureDialogForm from './EditExpenditureDialogForm';

export const MSG = defineMessages({
  errorAnnotation: {
    id: 'dashboard.EditExpenditureDialog.errorAnnotation',
    defaultMessage: 'Annotation is required',
  },
});

const displayName = 'dashboard.EditExpenditureDialog';

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
  const [confirmedValues, setConfirmedValues] = useState(newValues);
  const { formatMessage } = useIntl();

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

  const discardRecipientChange = useCallback((newRecipients) => {
    setConfirmedValues((confirmedVal) => {
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
      initialValues={{ forceAction: false, recipients: newValues?.recipients }}
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
          <Dialog cancel={close}>
            <EditExpenditureDialogForm
              {...{
                close,
                colony,
                confirmedValues,
                discardChange,
                discardRecipientChange,
                oldValues,
                onSubmitClick,
                isVotingExtensionEnabled,
                ...formValues,
              }}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

EditExpenditureDialog.displayName = displayName;

export default EditExpenditureDialog;
