import React, { useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import toFinite from 'lodash/toFinite';
import { defineMessages } from 'react-intl';
import { ethers } from 'ethers';

import { AnyUser } from '~data/index';
import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { Address } from '~types/index';

import { TransactionTypes } from './constants';
import ControlSafeForm, { NFT } from './ControlSafeForm';

const MSG = defineMessages({
  requiredFieldError: {
    id: 'dashboard.ControlSafeDialog.requiredFieldError',
    defaultMessage: 'Please enter a value',
  },
  gtZeroError: {
    id: 'dashboard.ControlSafeDialog.amountZero',
    defaultMessage: 'Amount must be greater than zero',
  },
  notIntegerError: {
    id: 'dashboard.ControlSafeDialog.integer',
    defaultMessage: 'Amount must be an integer',
  },
  notHexError: {
    id: 'dashboard.ControlSafeDialog.notHexError',
    defaultMessage: 'Value must be a valid hex string',
  },
});

export interface FormValues {
  transactions: {
    transactionType: string;
    tokenAddress?: Address;
    amount?: number;
    recipient?: AnyUser;
    data?: string;
    contract?: string;
    abi?: string;
    contractFunction?: string;
    nft: NFT;
  }[];
  safe: string;
  forceAction: boolean;
  transactionsTitle: string;
}

const displayName = 'dashboard.ControlSafeDialog';

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const validationSchema = (isPreview) =>
  yup.object().shape({
    safe: yup.string().required(() => MSG.requiredFieldError),
    ...(isPreview ? { transactionsTitle: yup.string().required() } : {}),
    transactions: yup.array(
      yup.object().shape({
        transactionType: yup.string().required(() => MSG.requiredFieldError),
        recipient: yup.object().shape({
          id: yup.string().address().required(),
          profile: yup.object().shape({
            walletAddress: yup.string().when('transactionType', {
              is: (transactionType) =>
                transactionType === TransactionTypes.TRANSFER_FUNDS,
              then: yup
                .string()
                .address()
                .required(() => MSG.requiredFieldError),
              otherwise: false,
            }),
          }),
        }),
        amount: yup.number().when('transactionType', {
          is: (transactionType) =>
            transactionType === TransactionTypes.TRANSFER_FUNDS ||
            transactionType === TransactionTypes.RAW_TRANSACTION,
          then: yup
            .number()
            .transform((value) => toFinite(value))
            .required(() => MSG.requiredFieldError)
            .moreThan(0, () => MSG.gtZeroError)
            .integer(() => MSG.notIntegerError),
          otherwise: false,
        }),
        tokenAddress: yup.string().when('transactionType', {
          is: (transactionType) =>
            transactionType === TransactionTypes.TRANSFER_FUNDS,
          then: yup
            .string()
            .address()
            .required(() => MSG.requiredFieldError),
          otherwise: false,
        }),
        data: yup.string().when('transactionType', {
          is: (transactionType) =>
            transactionType === TransactionTypes.RAW_TRANSACTION,
          then: yup
            .string()
            .required(() => MSG.requiredFieldError)
            .test(
              'is-hex',
              () => MSG.notHexError,
              (value) => ethers.utils.isHexString(value),
            ),
          otherwise: false,
        }),
        contract: yup.string().when('transactionType', {
          is: (transactionType) =>
            transactionType === TransactionTypes.CONTRACT_INTERACTION,
          then: yup
            .string()
            .address()
            .required(() => MSG.requiredFieldError),
          otherwise: false,
        }),
        abi: yup.string().when('transactionType', {
          is: (transactionType) =>
            transactionType === TransactionTypes.CONTRACT_INTERACTION,
          then: yup.string().required(() => MSG.requiredFieldError),
          otherwise: false,
        }),
        contractFunction: yup.string().when('transactionType', {
          is: (transactionType) =>
            transactionType === TransactionTypes.CONTRACT_INTERACTION,
          then: yup.string().required(() => MSG.requiredFieldError),
          otherwise: false,
        }),
        nft: yup
          .object()
          .shape({
            profile: yup.object().shape({
              displayName: yup.string().when('transactionType', {
                is: (transactionType) =>
                  transactionType === TransactionTypes.TRANSFER_NFT,
                then: yup.string().required(() => MSG.requiredFieldError),
                otherwise: false,
              }),
              walletAddress: yup.string().when('transactionType', {
                is: (transactionType) =>
                  transactionType === TransactionTypes.TRANSFER_NFT,
                then: yup
                  .string()
                  .address()
                  .required(() => MSG.requiredFieldError),
                otherwise: false,
              }),
            }),
          })
          .nullable(),
      }),
    ),
  });

const ControlSafeDialog = ({
  colony,
  cancel,
  callStep,
  prevStep,
  isVotingExtensionEnabled,
}: Props) => {
  const [showPreview, setShowPreview] = useState(false);
  const { safes } = colony;

  return (
    <ActionForm
      initialValues={{
        safe: '',
        transactionsTitle: undefined,
        transactions: [
          {
            transactionType: '',
            tokenAddress: colony.nativeTokenAddress,
            amount: undefined,
            recipient: null,
            data: '',
            contract: '',
            abi: '',
            contractFunction: '',
            nft: null,
          },
        ],
      }}
      validationSchema={validationSchema(showPreview)}
      submit={ActionTypes.ACTION_GENERIC}
      success={ActionTypes.ACTION_GENERIC_SUCCESS}
      error={ActionTypes.ACTION_GENERIC_ERROR}
      validateOnMount
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <ControlSafeForm
            {...formValues}
            back={callStep && prevStep ? () => callStep(prevStep) : undefined}
            colony={colony}
            safes={safes}
            isVotingExtensionEnabled={isVotingExtensionEnabled}
            showPreview={showPreview}
            handleShowPreview={setShowPreview}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

ControlSafeDialog.displayName = displayName;

export default ControlSafeDialog;
