import { isHexString } from 'ethers/utils';
import { toFinite } from 'lodash';
import { defineMessages, MessageDescriptor } from 'react-intl';
import * as yup from 'yup';

import { intl } from '~utils/intl';
import { validateType } from '~utils/safes';
import { TransactionTypes } from './constants';

const MSG = defineMessages({
  requiredFieldError: {
    id: 'dashboard.ControlSafeDialog.validation.requiredFieldError',
    defaultMessage: 'Please enter a value',
  },
  gtZeroError: {
    id: 'dashboard.ControlSafeDialog.validation.gtZeroError',
    defaultMessage: 'Amount must be greater than zero',
  },
  notIntegerError: {
    id: 'dashboard.ControlSafeDialog.validation.notIntegerError',
    defaultMessage: 'Amount must be an integer',
  },
  notSafeHexError: {
    id: 'dashboard.ControlSafeDialog.validation.notSafeHexError',
    defaultMessage: 'Hex string must be correct length and begin with 0x',
  },
  notHexError: {
    id: 'dashboard.ControlSafeDialog.validation.notHexError',
    defaultMessage: 'Value must be a valid hex string',
  },
  notAddressError: {
    id: 'dashboard.ControlSafeDialog.validation.notAddressError',
    defaultMessage: 'Address must be formatted correctly',
  },
  notBooleanError: {
    id: 'dashboard.ControlSafeDialog.validation.notBooleanError',
    defaultMessage: 'Value must be a valid boolean',
  },
  notSafeIntegerError: {
    id: 'dashboard.ControlSafeDialog.validation.notSafeIntegerError',
    defaultMessage: 'Amount must be a safe integer',
  },
  invalidArrayError: {
    id: 'dashboard.ControlSafeDialog.validation.invalidArrayError',
    defaultMessage: 'Value is not a valid array',
  },
  invalidAtIndexError: {
    id: 'dashboard.ControlSafeDialog.validation.invalidAtIndexError',
    defaultMessage: 'Item {idx} is not a valid {type}',
  },
});

export const getMethodInputValidation = (
  type: string,
  functionName: string,
) => {
  const { formatMessage } = intl;

  const getContractFunctionSchema = (
    testName: string,
    defaultMessage: MessageDescriptor | string,
  ) => {
    // yup.string() to facilitate custom testing.
    return yup.string().when('contractFunction', {
      is: functionName,
      then: yup
        .string()
        .required(() => MSG.requiredFieldError)
        .test(
          testName,
          () => defaultMessage,
          function validateFunctionInput(value) {
            if (!value) {
              return false;
            }
            const result = validateType(type, value);
            if (result === -1) {
              return this.createError({
                message: formatMessage(MSG.invalidArrayError),
              });
            }
            if (typeof result === 'number') {
              return this.createError({
                message: formatMessage(MSG.invalidAtIndexError, {
                  idx: result,
                  type,
                }),
              });
            }
            return result;
          },
        ),
      otherwise: false,
    });
  };

  if (type.includes('int')) {
    return getContractFunctionSchema(
      'is-integer-correct',
      MSG.notSafeIntegerError,
    );
  }
  if (type.includes('address')) {
    return getContractFunctionSchema('is-address-correct', MSG.notAddressError);
  }
  if (type.includes('byte')) {
    return getContractFunctionSchema(
      'is-valid-byte-array',
      MSG.notSafeHexError,
    );
  }
  if (type.includes('bool')) {
    return getContractFunctionSchema('is-bool', MSG.notBooleanError);
  }
  if (type.includes('string')) {
    return getContractFunctionSchema(
      'is-string',
      '', // will never not be a valid string. But might not be a valid string array.
    );
  }
  // Minimal validation for less common types
  return yup.string().when('contractFunction', {
    is: functionName,
    then: yup.string().required(() => MSG.requiredFieldError),
    otherwise: false,
  });
};

export const getValidationSchema = (
  showPreview: boolean,
  expandedValidationSchema: Record<string, any>,
) =>
  yup.object().shape({
    safe: yup.object().shape({
      id: yup.string().address().required(),
      profile: yup
        .object()
        .shape({
          displayName: yup.string().required(),
          walletAddress: yup.string().address().required(),
        })
        .required(() => MSG.requiredFieldError),
    }),
    ...(showPreview ? { transactionsTitle: yup.string().required() } : {}),
    transactions: yup.array(
      yup.object().shape({
        transactionType: yup.string().required(() => MSG.requiredFieldError),
        recipient: yup.object().when('transactionType', {
          is: (transactionType) =>
            transactionType === TransactionTypes.TRANSFER_FUNDS ||
            transactionType === TransactionTypes.TRANSFER_NFT,
          then: yup.object().shape({
            id: yup.string().address().required(),
            profile: yup.object().shape({
              walletAddress: yup
                .string()
                .address()
                .required(() => MSG.requiredFieldError),
            }),
          }),
          otherwise: yup.object().nullable(),
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
              (value) => isHexString(value),
            ),
          otherwise: false,
        }),
        contract: yup.object().when('transactionType', {
          is: (transactionType) =>
            transactionType === TransactionTypes.CONTRACT_INTERACTION,
          then: yup.object().shape({
            profile: yup.object().shape({
              walletAddress: yup
                .string()
                .address()
                .required(() => MSG.requiredFieldError),
            }),
          }),
          otherwise: yup.object().nullable(),
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
        nft: yup.object().when('transactionType', {
          is: (transactionType) =>
            transactionType === TransactionTypes.TRANSFER_NFT,
          then: yup.object().shape({
            profile: yup.object().shape({
              displayName: yup.string().required(() => MSG.requiredFieldError),
              walletAddress: yup
                .string()
                .required(() => MSG.requiredFieldError),
            }),
          }),
          otherwise: yup.object().nullable(),
        }),
        nftData: yup.object().when('transactionType', {
          is: (transactionType) =>
            transactionType === TransactionTypes.TRANSFER_NFT,
          then: yup.object().shape({
            address: yup.string(),
            description: yup.string().nullable(),
            id: yup.string(),
            imageUri: yup.string().nullable(),
            logoUri: yup.string(),
            metadata: yup.object(),
            name: yup.string().nullable(),
            tokenName: yup.string(),
            tokenSymbol: yup.string(),
            uri: yup.string(),
          }),
          otherwise: yup.object().nullable(),
        }),
        ...expandedValidationSchema,
      }),
    ),
  });
