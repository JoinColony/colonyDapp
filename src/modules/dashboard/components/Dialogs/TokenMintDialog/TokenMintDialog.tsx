import { FormikProps } from 'formik';
import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';
import toFinite from 'lodash/toFinite';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { RootMotionOperationNames } from '~redux/types/actions';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { WizardDialogType } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

import TokenMintForm from './TokenMintForm';

const MSG = defineMessages({
  errorAmountMin: {
    id: 'admin.Tokens.TokenMintDialog.errorAmountMin',
    defaultMessage: 'Please enter an amount greater than 0.',
  },
  errorAmountRequired: {
    id: 'admin.Tokens.TokenMintDialog.errorAmountRequired',
    defaultMessage: 'Please enter an amount.',
  },
});

export interface FormValues {
  forceAction: boolean;
  annotation: string;
  mintAmount: number;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const displayName = 'dashboard.TokenMintDialog';

const validationSchema = yup.object().shape({
  forceAction: yup.bool(),
  annotation: yup.string().max(4000),
  mintAmount: yup
    .number()
    .transform((value) => toFinite(value))
    .required(() => MSG.errorAmountRequired)
    .moreThan(0, () => MSG.errorAmountMin),
});

const TokenMintDialog = ({
  colony: { nativeTokenAddress, tokens = [], colonyAddress, colonyName },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const history = useHistory();

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`ROOT_MOTION${actionEnd}`]
        : ActionTypes[`ACTION_MINT_TOKENS${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const nativeToken =
    tokens && tokens.find(({ address }) => address === nativeTokenAddress);

  const transform = useCallback(
    pipe(
      mapPayload(
        ({ mintAmount: inputAmount, annotation: annotationMessage }) => {
          // Find the selected token's decimals
          const amount = bigNumberify(
            moveDecimal(
              inputAmount,
              getTokenDecimalsWithFallback(nativeToken?.decimals),
            ),
          );
          return {
            operationName: RootMotionOperationNames.MINT_TOKENS,
            colonyAddress,
            colonyName,
            nativeTokenAddress: nativeToken?.address,
            motionParams: [amount],
            amount,
            annotationMessage,
          };
        },
      ),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        forceAction: false,
        annotation: '',
        mintAmount: 0,
        /*
         * @NOTE That since this a root motion, and we don't actually make use
         * of the motion domain selected (it's disabled), we don't need to actually
         * pass the value over to the motion, since it will always be 1
         */
      }}
      validationSchema={validationSchema}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
      transform={transform}
    >
      {(formValues: FormikProps<FormValues>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <TokenMintForm
              {...formValues}
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              nativeToken={nativeToken}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

TokenMintDialog.displayName = displayName;

export default TokenMintDialog;
