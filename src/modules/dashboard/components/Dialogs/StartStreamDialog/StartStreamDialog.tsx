import { FormikProps } from 'formik';
import React, { useCallback, useState } from 'react';
import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';
import { ActionTypes } from '~redux/actionTypes';
import StartStreamDialogForm from './StartStreamDialogForm';

const displayName = 'dashboard.StartStreamDialog.StartStreamDialogForm';

export interface FormValues {
  forceAction: boolean;
  filteredDomainId: string;
  annotationMessage?: string;
}

interface Props {
  onClick: VoidFunction;
  cancel: VoidFunction;
  close: VoidFunction;
  colony: Colony;
  values: ValuesType;
  isVotingExtensionEnabled: boolean;
}

const StartStreamDialog = ({
  onClick,
  cancel,
  close,
  colony,
  values,
  isVotingExtensionEnabled,
}: Props) => {
  const [isForce, setIsForce] = useState(false);

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      // @TODO these action types are for mocking purposes, change to correct ones
      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  return (
    <ActionForm
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      initialValues={{ forceAction: false }}
    >
      {(formValues: FormikProps<FormValues>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <StartStreamDialogForm
              {...{
                onClick,
                colony,
                close,
                isVotingExtensionEnabled,
                formValues: values,
                ...formValues,
              }}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

StartStreamDialog.displayName = displayName;

export default StartStreamDialog;
