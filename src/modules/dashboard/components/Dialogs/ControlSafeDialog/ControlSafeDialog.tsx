import React, { useCallback, useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import { pipe } from 'lodash/fp';
import { useHistory } from 'react-router';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { ColonySafe, SafeBalanceToken, SafeTransaction } from '~data/index';
import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { AbiItemExtended } from '~utils/safes';
import {
  SelectedSafe,
  getChainNameFromSafe,
} from '~modules/dashboard/sagas/utils/safeHelpers';
import { mapPayload, withMeta } from '~utils/actions';
import { SAFE_NETWORKS } from '~constants';

import ControlSafeForm from './ControlSafeForm';
import { getMethodInputValidation, getValidationSchema } from './validation';

export interface SafeBalance {
  balance: number;
  tokenAddress: string | null;
  token: SafeBalanceToken | null;
}

export interface FormValues {
  transactions: SafeTransaction[];
  safe: SelectedSafe | null;
  safeBalances: SafeBalance[] | null;
  forceAction: boolean;
  transactionsTitle: string;
  motionDomainId: number;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

export type UpdatedMethods = {
  [key: number]: AbiItemExtended | undefined;
};

export const defaultTransaction: SafeTransaction = {
  transactionType: '',
  tokenData: null,
  amount: null,
  rawAmount: null,
  recipient: null,
  data: '',
  contract: null,
  abi: '',
  contractFunction: '',
  nft: null,
  nftData: null,
  functionParamTypes: null,
};

const displayName = 'dashboard.ControlSafeDialog';

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
  const [isForce, setIsForce] = useState(false);
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

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`MOTION_INITIATE_SAFE_TRANSACTION${actionEnd}`]
        : ActionTypes[`ACTION_INITIATE_SAFE_TRANSACTION${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const transform = useCallback(
    pipe(
      mapPayload(
        ({
          safe,
          transactionsTitle,
          transactions,
          annotation: annotationMessage,
          motionDomainId,
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
            motionDomainId,
          };
        },
      ),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={
        {
          safe: null,
          safeBalances: null,
          transactionsTitle: '',
          transactions: [defaultTransaction],
          forceAction: false,
          motionDomainId: ROOT_DOMAIN_ID,
        } as FormValues
      }
      validationSchema={validationSchema}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      transform={transform}
      onSuccess={close}
      validateOnMount
      /*
       * Needed to improve performance of, and avoid bugs in, the contract interaction section
       * (https://github.com/JoinColony/colonyDapp/issues/3803, https://github.com/JoinColony/colonyDapp/issues/3917)
       */
      validateOnChange={false}
    >
      {(formValues: FormikProps<FormValues>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <ControlSafeForm
              {...formValues}
              back={callStep && prevStep ? () => callStep(prevStep) : undefined}
              colony={colony}
              safes={safes}
              isVotingExtensionEnabled={isVotingExtensionEnabled}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
              selectedContractMethods={selectedContractMethods}
              setSelectedContractMethods={setSelectedContractMethods}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

ControlSafeDialog.displayName = displayName;

export default ControlSafeDialog;
