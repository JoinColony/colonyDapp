import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import toFinite from 'lodash/toFinite';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router';

import { ethers } from 'ethers';
import { AnyUser } from '~data/index';
import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { Address } from '~types/index';

import { TransactionTypes } from './constants';
import GnosisControlSafeForm, { NFT } from './GnosisControlSafeForm';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { Safe } from '~redux/types/actions/colonyActions';
import {
  isSafeOnCurrentNetwork,
  isSafeOwnedBySigner,
} from '~modules/dashboard/sagas/utils/safeHelpers';

const MSG = defineMessages({
  requiredFieldError: {
    id: 'dashboard.GnosisControlSafeDialog.requiredFieldError',
    defaultMessage: 'Please enter a value',
  },
  amountZero: {
    id: 'dashboard.GnosisControlSafeDialog.amountZero',
    defaultMessage: 'Amount must be greater than zero',
  },
  integer: {
    id: 'dashboard.GnosisControlSafeDialog.integer',
    defaultMessage: 'Amount must be an integer',
  },
  startWith0x: {
    id: 'dashboard.GnosisControlSafeDialog.startWith0x',
    defaultMessage: 'Data must begin with 0x',
  },
  validHex: {
    id: 'dashboard.GnosisControlSafeDialog.validHex',
    defaultMessage: `Data is not a valid hex string. Characters must be in the range of 0-9 a-F`,
  },
  invalidSafe: {
    id: 'dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.invalidSafe',
    defaultMessage:
      'Safe must be on the current network and owned by the logged-in user.',
  },
});

/* to remove when data is wired in */
const safes = [
  {
    name: 'All Saints',
    address: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c2',
    chain: 'Gnosis Chain',
  },
  {
    name: '',
    address: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c3',
    chain: 'Mainnet',
  },
  // Change to whichever Safe you would like to test with.
  {
    name: 'gracious-rinkeby-safe',
    address: '0x358E6D7C8Fa5e55fc6A0D50E23b875c6c49fF09A',
    chain: 'Rinkeby',
  },
];

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
  safe: Safe;
  forceAction: boolean;
  transactionsTitle: string;
}

const displayName = 'dashboard.GnosisControlSafeDialog';

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const validationSchema = (isPreview) =>
  yup.object().shape({
    safe: yup
      .object()
      .shape({
        id: yup.string().required(),
        profile: yup
          .object()
          .shape({
            displayName: yup.string().required(),
            walletAddress: yup.string().address().required(),
          })
          .required(),
      })
      .test(
        'valid-safe',
        () => MSG.invalidSafe,
        (safe) => {
          if (safe?.id) {
            /*
             * Tests whether safe is on the right network
             * and if it is owned by the signer.
             */
            return new Promise((resolve) => {
              isSafeOnCurrentNetwork(safe)
                .then((safeIsOnCurrentNetwork: boolean) => {
                  if (!safeIsOnCurrentNetwork) {
                    resolve(false);
                  }

                  isSafeOwnedBySigner(safe.id).then(
                    (safeIsOwnedBySigner: boolean) => {
                      resolve(safeIsOwnedBySigner);
                    },
                  );
                })
                .catch(() => resolve(false));
            });
          }
          return true;
        },
      )
      // Don't want to show message as it doesn't look nice with the async validation.
      // But, still need to pass in something for the error object.
      .required(() => {
        return {
          id: '',
        };
      })
      .nullable(),
    ...(isPreview
      ? {
          transactionsTitle: yup
            .string()
            .required(() => MSG.requiredFieldError),
        }
      : {}),
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
            .moreThan(0, () => MSG.amountZero)
            .integer(() => MSG.integer),
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
            .matches(/^0x/, () => MSG.startWith0x)
            .test(
              'is-hex',
              () => MSG.validHex,
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

const GnosisControlSafeDialog = ({
  colony: { colonyAddress, colonyName },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
  isVotingExtensionEnabled,
}: Props) => {
  const history = useHistory();
  const [showPreview, setShowPreview] = useState(false);
  const transform = useCallback(
    pipe(
      mapPayload(
        ({
          safe,
          transactionsTitle,
          transactions,
          annotation: annotationMessage,
        }) => {
          return {
            safe,
            transactionsTitle,
            transactions,
            annotationMessage,
            colonyAddress,
            colonyName,
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
        safe: null,
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
      submit={ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION}
      success={ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_SUCCESS}
      error={ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_ERROR}
      validateOnMount
      transform={transform}
      onSuccess={close}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <GnosisControlSafeForm
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

GnosisControlSafeDialog.displayName = displayName;

export default GnosisControlSafeDialog;
