import React, { useCallback, useState } from 'react';
import * as yup from 'yup';

import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/actionTypes';
import { Colony } from '~data/index';

import CancelExpenditureDialogForm from './CancelExpenditureDialogForm';
import { UserConsequences } from './types';

const displayName = 'dashboard.CancelExpenditureDialog';

export const validationSchema = yup.object().shape({
  forceAction: yup.bool(),
  effect: yup.string().required(),
  annotation: yup.string(),
});

export interface FormValues {
  forceAction: boolean;
  effect: string;
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
      initialValues={{ forceAction: false, effect: UserConsequences.Penalize }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
      validationSchema={validationSchema}
    >
      <CancelExpenditureDialogForm
        {...{
          close,
          isForce,
          onCancelExpenditure,
          setIsForce,
          colony,
          isVotingExtensionEnabled,
        }}
      />
    </ActionForm>
  );
};

CancelExpenditureDialog.displayName = displayName;

export default CancelExpenditureDialog;
