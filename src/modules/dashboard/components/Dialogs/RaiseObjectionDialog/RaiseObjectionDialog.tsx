import React, { useCallback, RefObject } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { bigNumberify } from 'ethers/utils';
import { Decimal } from 'decimal.js';

import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { pipe, mapPayload } from '~utils/actions';

import DialogForm, { Props as FormProps } from './RaiseObjectionDialogForm';

export interface FormValues {
  amount: number;
  annotation: string;
}

interface Props extends FormProps {
  cancel: () => void;
  close: () => void;
  motionId: number;
  scrollToRef?: RefObject<HTMLInputElement>;
}

const displayName = 'dashboard.RaiseObjectionDialog';

const RaiseObjectionDialog = ({
  cancel,
  close,
  colony: { colonyAddress },
  colony,
  minUserStake,
  motionId,
  scrollToRef,
  ...props
}: Props) => {
  const { walletAddress } = useLoggedInUser();

  const validationSchema = yup.object().shape({
    amount: yup.number().required(),
  });

  const transform = useCallback(
    pipe(
      mapPayload(({ amount, annotation: annotationMessage }) => {
        const { remainingToFullyNayStaked } = props;
        const remainingToStake = new Decimal(remainingToFullyNayStaked);
        const stake = new Decimal(amount)
          .div(100)
          .times(remainingToStake.minus(minUserStake))
          .plus(minUserStake);
        const stakeWithMin = new Decimal(minUserStake).gte(stake)
          ? new Decimal(minUserStake)
          : stake;
        return {
          amount: stakeWithMin.round().toString(),
          userAddress: walletAddress,
          colonyAddress,
          motionId: bigNumberify(motionId),
          vote: 0,
          annotationMessage,
        };
      }),
    ),
    [walletAddress, colonyAddress, motionId],
  );

  const handleSuccess = useCallback(
    (_, { setFieldValue, resetForm }) => {
      resetForm({});
      setFieldValue('amount', 0);
      scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
      close();
    },
    [scrollToRef, close],
  );

  return (
    <ActionForm
      initialValues={{
        amount: 0,
        annotation: undefined,
      }}
      submit={ActionTypes.MOTION_STAKE}
      error={ActionTypes.MOTION_STAKE_ERROR}
      success={ActionTypes.MOTION_STAKE_SUCCESS}
      validationSchema={validationSchema}
      onSubmit={close}
      onSuccess={handleSuccess}
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
