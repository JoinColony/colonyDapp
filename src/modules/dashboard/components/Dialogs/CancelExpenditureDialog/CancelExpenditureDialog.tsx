import React, { useCallback, useState } from 'react';
import * as yup from 'yup';

import { FormikProps } from 'formik';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/actionTypes';
import { Colony } from '~data/index';

import { CancelExpenditureForm } from '.';
import { PenalizeType } from './types';

const displayName = 'dashboard.CancelExpenditureDialog';

export const validationSchema = yup.object().shape({
  forceAction: yup.bool(),
  effect: yup.string().required(),
  annotation: yup.string(),
});

export interface FormValues {
  forceAction: boolean;
  effect: PenalizeType;
  annotation: string;
}

interface Props {
  close: () => void;
  colony: Colony;
  onCancelExpenditure: (isForce: boolean) => void;
  isVotingExtensionEnabled: boolean;
}

const CancelExpenditureDialog = ({
  close,
  colony,
  onCancelExpenditure,
  isVotingExtensionEnabled,
}: Props) => {
  const [isForce, setIsForce] = useState(false);

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return !isForce
        ? ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_GENERIC${actionEnd}`];
    },
    [isForce],
  );

  return (
    <ActionForm
      initialValues={{ forceAction: false, effect: PenalizeType.Penalize }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
      validationSchema={validationSchema}
    >
      {(formValues: FormikProps<FormValues>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <CancelExpenditureForm
            {...{
              close,
              onCancelExpenditure,
              colony,
              isVotingExtensionEnabled,
              ...formValues,
            }}
          />
        );
      }}
    </ActionForm>
  );
};

CancelExpenditureDialog.displayName = displayName;

export default CancelExpenditureDialog;
