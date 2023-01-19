import React, { useCallback, useState } from 'react';
import * as yup from 'yup';
import { FormikProps } from 'formik';

import { ActionForm } from '~core/Fields';
import Dialog from '~core/Dialog';
import { Colony } from '~data/index';
import { ActionTypes } from '~redux/actionTypes';
import { ValuesType } from '~pages/IncorporationPage/types';

import EditIncorporationDialogForm from './EditIncorporationDialogForm';

const displayName = 'dashboard.EditIncorporationDialog';

export const validationSchema = yup.object().shape({
  forceAction: yup.bool(),
  annotationMessage: yup.string(),
});

export interface FormValuesType {
  forceAction: boolean;
  annotationMessage?: string;
}

interface Props {
  onSubmitClick: (
    values: Partial<ValuesType> | undefined,
    wasForced: boolean,
  ) => void;
  onCancelClick: VoidFunction;
  close: () => void;
  isVotingExtensionEnabled: boolean;
  colony: Colony;
  newValues?: Partial<ValuesType>;
  oldValues: ValuesType;
}

const EditIncorporationDialog = ({
  close,
  onSubmitClick,
  onCancelClick,
  isVotingExtensionEnabled,
  colony,
  newValues,
  oldValues,
}: Props) => {
  const [isForce, setIsForce] = useState(false);

  const discardChange = useCallback(() => {
    close();
    onCancelClick?.();
  }, [close, onCancelClick]);

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
      validationSchema={validationSchema}
    >
      {(formValues: FormikProps<FormValuesType>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <Dialog cancel={close}>
            <EditIncorporationDialogForm
              {...{
                close,
                colony,
                confirmedValues: newValues,
                discardChange,
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

EditIncorporationDialog.displayName = displayName;

export default EditIncorporationDialog;
