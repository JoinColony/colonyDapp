import React, { useCallback, useMemo, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import moveDecimal from 'move-decimal-point';
import { bigNumberify } from 'ethers/utils';
import { useHistory } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import sortBy from 'lodash/sortBy';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import toFinite from 'lodash/toFinite';

import { pipe, mapPayload, withMeta } from '~utils/actions';
import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import Dialog, { ActionDialogProps, DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { WizardDialogType } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

import DialogForm from './TransferFundsDialogForm';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

const MSG = defineMessages({
  amountZero: {
    id: 'dashboard.TransferFundsDialog.amountZero',
    defaultMessage: 'Amount must be greater than zero',
  },
  noBalance: {
    id: 'dashboard.TransferFundsDialog.noBalance',
    defaultMessage: 'Insufficient balance in from domain pot',
  },
});

export interface FormValues {
  forceAction: boolean;
  fromDomain?: string;
  toDomain?: string;
  amount: string;
  tokenAddress?: Address;
  annotation: string;
}

interface CustomWizardDialogProps extends ActionDialogProps {
  ethDomainId?: number;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'dashboard.TransferFundsDialog';

const TransferFundsDialog = ({
  colony: {
    tokens = [],
    colonyAddress,
    nativeTokenAddress,
    colonyName,
    version,
    domains,
  },
  colony,
  ethDomainId: selectedDomainId,
  callStep,
  prevStep,
  cancel,
  close,
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
        ? ActionTypes[`MOTION_MOVE_FUNDS${actionEnd}`]
        : ActionTypes[`ACTION_MOVE_FUNDS${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const validationSchema = yup.object().shape({
    fromDomain: yup.number().required(),
    toDomain: yup.number().required(),
    amount: yup
      .number()
      .transform((value) => toFinite(value))
      .required()
      .moreThan(0, () => MSG.amountZero),
    tokenAddress: yup.string().address().required(),
    annotation: yup.string().max(4000),
  });

  const domainOptions = useMemo(
    () =>
      sortBy(
        domains.map(({ name, ethDomainId }) => ({
          value: ethDomainId.toString(),
          label: name,
        })),
        ['value'],
      ),
    [domains],
  );

  const transform = useCallback(
    pipe(
      mapPayload(
        ({
          tokenAddress,
          amount: transferAmount,
          fromDomain: sourceDomain,
          toDomain,
          annotation: annotationMessage,
        }) => {
          const selectedToken = tokens.find(
            (token) => token.address === tokenAddress,
          );
          const decimals = getTokenDecimalsWithFallback(
            selectedToken && selectedToken.decimals,
          );

          // Convert amount string with decimals to BigInt (eth to wei)
          const amount = bigNumberify(moveDecimal(transferAmount, decimals));

          return {
            colonyAddress,
            colonyName,
            version,
            fromDomainId: parseInt(sourceDomain, 10),
            toDomainId: parseInt(toDomain, 10),
            amount,
            tokenAddress,
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
        fromDomain: selectedDomainId
          ? String(selectedDomainId)
          : ROOT_DOMAIN_ID.toString(),
        toDomain:
          domainOptions.find(
            (domain) => domain.value !== selectedDomainId?.toString(),
          )?.value || ROOT_DOMAIN_ID.toString(),
        amount: '',
        tokenAddress: nativeTokenAddress,
        annotation: undefined,
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
      validateOnChange
    >
      {(formValues: FormikProps<FormValues>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...formValues}
              colony={colony}
              domainOptions={domainOptions}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

TransferFundsDialog.displayName = displayName;

export default TransferFundsDialog;
