import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { bigNumberify } from 'ethers/utils';

import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { pipe, mapPayload, withMeta } from '~utils/actions';

import DialogForm from './RaiseObjectionDialogForm';
import { Address } from '~types/index';

export interface FormValues {
  amount: number;
  annotation: string;
}

interface Props {
  colonyAddress: Address;
  cancel: () => void;
  close: () => void;
  tokenDecimals: number;
}

const displayName = 'dashboard.RaiseObjectionDialog';

const RaiseObjectionDialog = ({
  cancel,
  close,
  colonyAddress,
  tokenDecimals,
}: Props) => {
  const history = useHistory();
  const { walletAddress } = useLoggedInUser();

  const validationSchema = yup.object().shape({
    amount: yup.number().required(),
    annotation: yup.string().max(90),
  });

  const transform = useCallback(
    pipe(
      mapPayload(({ annotation: annotationMessage, amount }) => {
        return {
          amount: bigNumberify(amount).mul(bigNumberify(10).pow(tokenDecimals)),
          colonyAddress,
          walletAddress,
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
        annotation: undefined,
      }}
      submit={ActionTypes.MOTION_OBJECT}
      error={ActionTypes.MOTION_OBJECT_ERROR}
      success={ActionTypes.MOTION_OBJECT_SUCCESS}
      validationSchema={validationSchema}
      onSuccess={close}
      transform={transform}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <DialogForm {...formValues} />
        </Dialog>
      )}
    </ActionForm>
  );
};

RaiseObjectionDialog.displayName = displayName;

export default RaiseObjectionDialog;
