import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';

import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { AnyToken, useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import DialogForm, { Props as FormProps } from './RaiseObjectionDialogForm';

export interface FormValues {
  amount: number;
  annotation: string;
}

interface Props extends FormProps {
  cancel: () => void;
  close: () => void;
  motionId: number;
  nativeToken?: AnyToken;
}

const displayName = 'dashboard.RaiseObjectionDialog';

const RaiseObjectionDialog = ({
  cancel,
  close,
  colony,
  minUserStake,
  nativeToken,
  motionId,
  ...props
}: Props) => {
  const history = useHistory();
  const { walletAddress } = useLoggedInUser();

  const validationSchema = yup.object().shape({
    amount: yup.number().required(),
    annotation: yup.string().max(90),
  });

  const userStakeBottomLimit = moveDecimal(
    minUserStake,
    -1 * getTokenDecimalsWithFallback(nativeToken?.decimals),
  );

  const transform = useCallback(
    pipe(
      mapPayload(({ annotation: annotationMessage, amount }) => {
        return {
          amount: bigNumberify(
            moveDecimal(
              amount,
              getTokenDecimalsWithFallback(nativeToken?.decimals),
            ),
          ),
          userAddress: walletAddress,
          colonyAddress: colony.colonyAddress,
          motionId: bigNumberify(motionId),
          vote: 0,
          annotationMessage,
        };
      }),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        amount: parseFloat(userStakeBottomLimit),
        annotation: undefined,
      }}
      submit={ActionTypes.COLONY_MOTION_STAKE}
      error={ActionTypes.COLONY_MOTION_STAKE_ERROR}
      success={ActionTypes.COLONY_MOTION_STAKE_SUCCESS}
      validationSchema={validationSchema}
      onSuccess={close}
      transform={transform}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <DialogForm
            {...formValues}
            colony={colony}
            minUserStake={minUserStake}
            cancel={cancel}
            {...props}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

RaiseObjectionDialog.displayName = displayName;

export default RaiseObjectionDialog;
