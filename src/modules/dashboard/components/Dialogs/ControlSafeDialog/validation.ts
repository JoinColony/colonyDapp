import { bigNumberify, isHexString } from 'ethers/utils';
import { toFinite } from 'lodash';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { isAddress } from 'web3-utils';
import * as yup from 'yup';
import moveDecimal from 'move-decimal-point';
import Maybe from 'graphql/tsutils/Maybe';

import { intl } from '~utils/intl';
import { isAbiItem, validateType, getSelectedSafeBalance } from '~utils/safes';

import { TransactionTypes } from './constants';

import { SafeBalance } from '.';

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
  notAbiError: {
    id: 'dashboard.ControlSafeDialog.validation.notAbiError',
    defaultMessage: 'Value must be a valid contract ABI',
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
  insuffienctFundsError: {
    id: `dashboard.ControlSafeDialog.validation.insufficientFundsError`,
    defaultMessage: 'Insufficient safe balance',
  },
  balanceError: {
    id: `dashboard.ControlSafeDialog.validation.balanceError`,
    defaultMessage: 'Could not retreive balance information',
  },
});

const { formatMessage } = intl;

export const getMethodInputValidation = (
  type: string,
  functionName: string,
) => {
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
    ...(showPreview
      ? {
          transactionsTitle: yup
            .string()
            .trim()
            .required(() => MSG.requiredFieldError),
        }
      : {}),
    transactions: yup.array(
      yup.object().shape({
        transactionType: yup.string().required(() => MSG.requiredFieldError),
        recipient: yup.object().when('transactionType', {
          is: (transactionType) =>
            transactionType === TransactionTypes.TRANSFER_FUNDS ||
            transactionType === TransactionTypes.RAW_TRANSACTION ||
            transactionType === TransactionTypes.TRANSFER_NFT,
          then: yup.object().shape({
            id: yup
              .string()
              .required()
              .test(
                'is-valid-id',
                formatMessage(MSG.notAddressError),
                function validateId(value) {
                  if (value) {
                    /*
                     * id may be 'filterValue' if a contract address is manually entered.
                     * May occur in raw transaction section.
                     */
                    if (value === 'filterValue') {
                      return isAddress(this.parent.profile.walletAddress);
                    }
                    return isAddress(value);
                  }
                  return false;
                },
              ),
            profile: yup.object().shape({
              walletAddress: yup
                .string()
                .address()
                .required(() => MSG.requiredFieldError),
            }),
          }),
          otherwise: yup.object().nullable(),
        }),
        amount: yup.string().when('transactionType', {
          is: TransactionTypes.TRANSFER_FUNDS,
          then: yup
            .string()
            .nullable()
            .test(
              'check-amount',
              formatMessage(MSG.balanceError),
              async function testSafeBalance(value) {
                if (!value) {
                  return this.createError({
                    message: formatMessage(MSG.requiredFieldError),
                  });
                }
                if (Number(value) <= 0) {
                  return this.createError({
                    message: formatMessage(MSG.gtZeroError),
                  });
                }
                const selectedToken = this.parent.tokenData?.address;
                const selectedTokenDecimals = this.parent.tokenData?.decimals;

                const {
                  safeBalances,
                }: {
                  safeBalances: Maybe<SafeBalance[]>;
                  // Type is incorrect. "from" does appear in yup.TextContext
                  // @ts-ignore
                } = this.from[1].value;
                const safeBalance = getSelectedSafeBalance(
                  safeBalances,
                  selectedToken,
                );

                if (safeBalance) {
                  const convertedAmount = bigNumberify(
                    moveDecimal(value, selectedTokenDecimals),
                  );
                  const balance = bigNumberify(safeBalance.balance);
                  if (balance.lt(convertedAmount) || balance.isZero()) {
                    return this.createError({
                      message: formatMessage(MSG.insuffienctFundsError),
                    });
                  }
                  return true;
                }
                return this.createError({
                  message: formatMessage(MSG.balanceError),
                });
              },
            ),
          otherwise: yup.string().nullable(),
        }),
        rawAmount: yup.number().when('transactionType', {
          is: TransactionTypes.RAW_TRANSACTION,
          then: yup
            .number()
            .transform((value) => toFinite(value))
            .required(() => MSG.requiredFieldError)
            .integer(() => MSG.notIntegerError),
          otherwise: yup.number().nullable(),
        }),
        data: yup.string().when('transactionType', {
          is: TransactionTypes.RAW_TRANSACTION,
          then: yup
            .string()
            .required(() => MSG.requiredFieldError)
            .test(
              'is-hex',
              () => MSG.notHexError,
              (value) => isHexString(value),
            ),
          otherwise: yup.string(),
        }),
        contract: yup.object().when('transactionType', {
          is: TransactionTypes.CONTRACT_INTERACTION,
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
          is: TransactionTypes.CONTRACT_INTERACTION,
          then: yup
            .string()
            .required(() => MSG.requiredFieldError)
            .test(
              'is-abi-item',
              () => MSG.notAbiError,
              (value) => {
                if (value) {
                  try {
                    return isAbiItem(JSON.parse(value));
                  } catch (error) {
                    return false;
                  }
                }
                return false;
              },
            ),
          otherwise: yup.string(),
        }),
        contractFunction: yup.string().when('transactionType', {
          is: TransactionTypes.CONTRACT_INTERACTION,
          then: yup.string().required(() => MSG.requiredFieldError),
          otherwise: yup.string(),
        }),
        nft: yup.object().when('transactionType', {
          is: TransactionTypes.TRANSFER_NFT,
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
          is: TransactionTypes.TRANSFER_NFT,
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
    forceAction: yup.boolean(),
    motionDomainId: yup.number(),
  });
