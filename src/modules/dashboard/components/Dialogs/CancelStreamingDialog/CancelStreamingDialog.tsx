import React, { useCallback, useState } from 'react';
import * as yup from 'yup';

import { FormikProps } from 'formik';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/actionTypes';
import { Colony } from '~data/index';

import { CancelStreamingForm } from '.';
import { PenalizeType } from './types';

const displayName = 'dashboard.CancelStreamingDialog';

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
  onCancelStreaming: (isForce: boolean) => void;
  isVotingExtensionEnabled: boolean;
}

const CancelStreamingDialog = ({
  close,
  colony,
  onCancelStreaming,
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
          <CancelStreamingForm
            {...{
              close,
              onCancelStreaming,
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

CancelStreamingDialog.displayName = displayName;

export default CancelStreamingDialog;
