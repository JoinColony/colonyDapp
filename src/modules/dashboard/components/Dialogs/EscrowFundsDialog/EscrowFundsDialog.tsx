import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';

import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/actionTypes';
import { Colony } from '~data/index';

import EscrowFundsDialogForm from './EscrowFundsDialogForm';

const displayName = 'dashboard.EscrowFundsDialog';

export interface FormValues {
  forceAction: boolean;
  filteredDomainId: string;
  annotationMessage?: string;
}

interface Props {
  cancel: VoidFunction;
  close: VoidFunction;
  handleSubmitClick: VoidFunction;
  colony: Colony;
  isVotingExtensionEnabled: boolean;
}

const EscrowFundsDialog = ({
  cancel,
  handleSubmitClick,
  close,
  colony,
  isVotingExtensionEnabled,
}: Props) => {
  const [isForce, setIsForce] = useState(false);

  const onSubmitClick = useCallback(() => {
    handleSubmitClick();
    close();
  }, [handleSubmitClick, close]);

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
    <Dialog cancel={cancel}>
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
            <EscrowFundsDialogForm
              {...{
                colony,
                close,
                onSubmitClick,
                isVotingExtensionEnabled,
                ...formValues,
              }}
            />
          );
        }}
      </ActionForm>
    </Dialog>
  );
};

EscrowFundsDialog.displayName = displayName;

export default EscrowFundsDialog;
