import { FormikProps } from 'formik';
import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { pipe, mapPayload, withMeta } from '~utils/actions';

import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { WizardDialogType } from '~utils/hooks';

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

interface CustomWizardDialogProps {
  prevStep?: string;
  colony: Colony;
  isVotingExtensionEnabled: boolean;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'dashboard.TokenMintDialog';

const validationSchema = yup.object().shape({
  annotation: yup.string().max(4000),
  mintAmount: yup
    .number()
    .required(() => MSG.errorAmountRequired)
    .moreThan(0, () => MSG.errorAmountMin),
});

const TokenMintDialog = ({
  colony: { nativeTokenAddress, tokens = [], colonyAddress, colonyName },
  colony,
  isVotingExtensionEnabled,
  cancel,
  close,
  callStep,
  prevStep,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const history = useHistory();

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      /* need to add the condition that force toggle is not on */
      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_MOTION_MINT_TOKENS${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_MINT_TOKENS${actionEnd}`];
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
            colonyAddress,
            colonyName,
            nativeTokenAddress: nativeToken?.address,
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
              isVotingExtensionEnabled={isVotingExtensionEnabled}
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
