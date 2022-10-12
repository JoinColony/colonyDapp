import React, { useCallback, useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import { pipe } from 'lodash/fp';
import { useHistory } from 'react-router';
import { AddressZero } from 'ethers/constants';

import { AnyToken, AnyUser, ColonySafe } from '~data/index';
import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { AbiItemExtended } from '~utils/safes';
import {
  SelectedSafe,
  SelectedNFT,
  getChainNameFromSafe,
} from '~modules/dashboard/sagas/utils/safeHelpers';
import { mapPayload, withMeta } from '~utils/actions';
import { SafeBalanceToken } from '~types/index';
import { SAFE_NETWORKS } from '~constants';

import ControlSafeForm from './ControlSafeForm';
import { NFT } from './TransactionTypesSection/TransferNFTSection';
import { getMethodInputValidation, getValidationSchema } from './validation';

export interface SafeBalance {
  balance: number;
  tokenAddress: string | null;
  token: AnyToken | null;
}

export interface SafeTransaction {
  transactionType: string;
  recipient: AnyUser | null;
  nft: SelectedNFT | null;
  nftData: NFT | null;
  tokenAddress: string;
  tokenData: SafeBalanceToken | null;
  amount?: number;
  rawAmount?: number;
  data?: string;
  contract?: AnyUser;
  abi?: string;
  contractFunction?: string;
}

export interface FormValues {
  transactions: SafeTransaction[];
  safe: SelectedSafe | null;
  safeBalances?: SafeBalance[] | null;
  forceAction: boolean;
  transactionsTitle: string;
}

const displayName = 'dashboard.ControlSafeDialog';

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

export type UpdatedMethods = {
  [key: number]: AbiItemExtended | undefined;
};
const ControlSafeDialog = ({
  colony: { colonyAddress, colonyName },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
  isVotingExtensionEnabled,
}: Props) => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedContractMethods, setSelectedContractMethods] = useState<
    UpdatedMethods
  >();
  const [expandedValidationSchema, setExpandedValidationSchema] = useState<
    Record<string, any>
  >({});
  const { safes } = colony;
  const history = useHistory();

  useEffect(() => {
    if (selectedContractMethods) {
      const updatedExpandedValidationSchema = {};

      Object.values(selectedContractMethods).forEach((method) => {
        method?.inputs?.forEach((input) => {
          const inputName = `${input.name}-${method.name}`;
          if (!updatedExpandedValidationSchema[inputName]) {
            updatedExpandedValidationSchema[
              inputName
            ] = getMethodInputValidation(input.type, method.name);
          }
        });
      });

      setExpandedValidationSchema(updatedExpandedValidationSchema);
    }
  }, [selectedContractMethods]);

  const validationSchema = getValidationSchema(
    showPreview,
    expandedValidationSchema,
  );

  const transform = useCallback(
    pipe(
      mapPayload(
        ({
          safe,
          transactionsTitle,
          transactions,
          annotation: annotationMessage,
        }) => {
          const chainName = getChainNameFromSafe(safe.profile.displayName);
          const transformedSafe: Omit<ColonySafe, 'safeName'> = {
            // Find will return because input comes from Safe Networks
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            chainId: SAFE_NETWORKS.find(
              (network) => network.name === chainName,
            )!.chainId.toString(),
            contractAddress: safe.profile.walletAddress,
            moduleContractAddress: safe.id,
          };
          return {
            safe: transformedSafe,
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
        safeBalances: undefined,
        transactionsTitle: undefined,
        transactions: [
          {
            transactionType: '',
            tokenAddress: AddressZero,
            tokenData: null,
            amount: undefined,
            rawAmount: undefined,
            recipient: undefined,
            data: '',
            contract: undefined,
            abi: '',
            contractFunction: '',
            nft: null,
            nftData: null,
          },
        ],
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION}
      success={ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_SUCCESS}
      error={ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_ERROR}
      transform={transform}
      onSuccess={close}
      validateOnMount
      /*
       * Needed to improve performance of, and avoid bugs in, the contract interaction section
       * (https://github.com/JoinColony/colonyDapp/issues/3803, https://github.com/JoinColony/colonyDapp/issues/3917)
       */
      validateOnChange={false}
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
            selectedContractMethods={selectedContractMethods}
            handleSelectedContractMethods={setSelectedContractMethods}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

ControlSafeDialog.displayName = displayName;

export default ControlSafeDialog;
