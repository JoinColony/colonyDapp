import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';

import { TransactionTypes } from '~dashboard/Dialogs/ControlSafeDialog/constants';
import { ColonySafe, SafeTransaction } from '~data/index';
import { intl } from '~utils/intl';
import { extractTokenName } from '~modules/dashboard/sagas/utils/safeHelpers';

import {
  InvisibleCopyableMaskedAddress,
  ContractName,
} from '../../DetailsWidgetSafeTransaction';

import widgetStyles from '../../DetailsWidget.css';

const MSG = defineMessage({
  function: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.ContractSection.function`,
    defaultMessage: 'Function',
  },
  nft: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.ContractSection.nft`,
    defaultMessage: 'NFT',
  },
  token: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.ContractSection.token`,
    defaultMessage: 'Token',
  },
  unknownContract: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.ContractSection.unknownContract`,
    defaultMessage: 'Unknown contract',
  },
  contractAddress: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.ContractSection.contractAddress`,
    defaultMessage: 'Contract address',
  },
});

export const { unknownContract: unknownContractMSG, nft: nftMSG } = MSG;

export interface ContractSectionProps {
  transaction: SafeTransaction;
  safe: ColonySafe;
  hideFunctionContract?: boolean;
}

export const ContractSection = ({
  transaction,
  safe,
  hideFunctionContract,
}: ContractSectionProps) => {
  const functionContract =
    transaction.contract?.id ||
    transaction.tokenData?.address ||
    transaction.nftData?.address;

  const getContractInfo = (safeTransaction: SafeTransaction) => {
    const { formatMessage } = intl;
    const { transactionType } = safeTransaction;
    const contractInfo = {
      contractName: safe.safeName,
      contractAddress: safe.contractAddress,
    };

    switch (transactionType) {
      case TransactionTypes.TRANSFER_NFT:
        contractInfo.contractName =
          extractTokenName(
            safeTransaction.nftData?.name ||
              safeTransaction.nftData?.tokenName ||
              '',
          ) || formatMessage(MSG.nft);
        contractInfo.contractAddress =
          safeTransaction.nftData?.address || safe.contractAddress;
        break;
      case TransactionTypes.TRANSFER_FUNDS:
        contractInfo.contractName =
          safeTransaction.tokenData?.name || formatMessage(MSG.token);
        contractInfo.contractAddress =
          safeTransaction.tokenData?.address || safe.contractAddress;
        break;
      case TransactionTypes.CONTRACT_INTERACTION:
        contractInfo.contractName =
          safeTransaction.contract?.profile.displayName ||
          formatMessage(MSG.unknownContract);
        contractInfo.contractAddress =
          safeTransaction.contract?.profile.walletAddress ||
          safe.contractAddress;
        break;
      default:
        break;
    }

    return contractInfo;
  };

  const { contractName, contractAddress } = getContractInfo(transaction);

  return (
    <>
      <ContractName name={contractName} address={contractAddress} />
      {functionContract && !hideFunctionContract && (
        <div className={widgetStyles.item}>
          <div className={widgetStyles.label}>
            <FormattedMessage {...MSG.contractAddress} />
          </div>
          <div className={widgetStyles.value}>
            <InvisibleCopyableMaskedAddress address={functionContract} />
          </div>
        </div>
      )}
      {transaction.contractFunction && (
        <div className={widgetStyles.item}>
          <div className={widgetStyles.label}>
            <FormattedMessage {...MSG.function} />
          </div>
          <div className={widgetStyles.value}>
            <span>{transaction.contractFunction}</span>
          </div>
        </div>
      )}
    </>
  );
};
