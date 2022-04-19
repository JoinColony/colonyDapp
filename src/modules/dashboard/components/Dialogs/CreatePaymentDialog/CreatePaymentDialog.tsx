import React, { useCallback, useMemo, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';
import toFinite from 'lodash/toFinite';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import {
  useVerifiedUsersQuery,
  useColonyFromNameQuery,
  AnyUser,
  useMembersSubscription,
} from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { WizardDialogType } from '~utils/hooks';

import DialogForm from './CreatePaymentDialogForm';

const MSG = defineMessages({
  amountZero: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialog.amountZero',
    defaultMessage: 'Amount must be greater than zero',
  },
  noBalance: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialog.noBalance',
    defaultMessage: 'Insufficient balance in from domain pot',
  },
});

export interface FormValues {
  forceAction: boolean;
  domainId: string;
  recipient: AnyUser;
  amount: string;
  tokenAddress: Address;
  annotation: string;
  motionDomainId: string;
}

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    ethDomainId?: number;
  };

const displayName = 'dashboard.CreatePaymentDialog';

const CreatePaymentDialog = ({
  colony: { tokens = [], colonyAddress, nativeTokenAddress, colonyName },
  colony,
  isVotingExtensionEnabled,
  callStep,
  prevStep,
  cancel,
  close,
  ethDomainId,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const history = useHistory();

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_MOTION_EXPENDITURE_PAYMENT${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_EXPENDITURE_PAYMENT${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const validationSchema = yup.object().shape({
    domainId: yup.number().required(),
    recipient: yup.object().shape({
      profile: yup.object().shape({
        walletAddress: yup.string().address().required(),
      }),
    }),
    amount: yup
      .number()
      .transform((value) => toFinite(value))
      .required()
      .moreThan(0, () => MSG.amountZero),
    tokenAddress: yup.string().address().required(),
    annotation: yup.string().max(4000),
    forceAction: yup.boolean(),
    motionDomainId: yup.number(),
  });

  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  const { data: colonyData } = useColonyFromNameQuery({
    variables: { name: colonyName, address: colonyAddress },
  });
  const isWhiteListActive = colonyData?.processedColony?.isWhitelistActivated;

  const { data } = useVerifiedUsersQuery({
    variables: {
      verifiedAddresses:
        colonyData?.processedColony?.whitelistedAddresses || [],
    },
    fetchPolicy: 'network-only',
  });

  const storedVerifiedRecipients = useMemo(
    () =>
      (data?.verifiedUsers || []).map((user) => user?.profile.walletAddress),
    [data],
  );

  const filteredVerifiedRecipients = isWhiteListActive
    ? (colonyMembers?.subscribedUsers || []).filter((member) =>
        storedVerifiedRecipients.some(
          (el) => el.toLowerCase() === member.id.toLowerCase(),
        ),
      )
    : colonyMembers?.subscribedUsers || [];

  const getIsUnverifiedRecipient = (walletAddress) => {
    if (!walletAddress) return false;
    return isWhiteListActive
      ? !storedVerifiedRecipients.some(
          (el) => el.toLowerCase() === walletAddress.toLowerCase(),
        )
      : false;
  };

  const transform = useCallback(
    pipe(
      mapPayload((payload) => {
        const {
          amount,
          tokenAddress,
          domainId,
          recipient: {
            profile: { walletAddress },
          },
          annotation: annotationMessage,
          motionDomainId,
        } = payload;

        const selectedToken = tokens.find(
          (token) => token.address === tokenAddress,
        );
        const decimals = getTokenDecimalsWithFallback(
          selectedToken && selectedToken.decimals,
        );

        return {
          colonyName,
          colonyAddress,
          recipientAddress: walletAddress,
          domainId,
          singlePayment: {
            tokenAddress,
            amount,
            decimals,
          },
          annotationMessage,
          motionDomainId,
        };
      }),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        forceAction: false,
        domainId: (ethDomainId === 0 || ethDomainId === undefined
          ? ROOT_DOMAIN_ID
          : ethDomainId
        ).toString(),
        recipient: undefined,
        amount: undefined,
        tokenAddress: nativeTokenAddress,
        annotation: undefined,
        motionDomainId: (ethDomainId === 0 || ethDomainId === undefined
          ? ROOT_DOMAIN_ID
          : ethDomainId
        ).toString(),
      }}
      validationSchema={validationSchema}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      transform={transform}
      onSuccess={close}
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
              isVotingExtensionEnabled={isVotingExtensionEnabled}
              back={() => callStep(prevStep)}
              subscribedUsers={filteredVerifiedRecipients}
              ethDomainId={ethDomainId}
              showWhitelistWarning={getIsUnverifiedRecipient(
                formValues.values?.recipient?.profile?.walletAddress,
              )}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

CreatePaymentDialog.displayName = displayName;

export default CreatePaymentDialog;
