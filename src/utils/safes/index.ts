import { AddressZero } from 'ethers/constants';
import { TransactionTypes } from '~dashboard/Dialogs/ControlSafeDialog/constants';

import { SafeBalance } from '~dashboard/Dialogs/ControlSafeDialog/ControlSafeDialog';
import { ColonySafe, NftData, SafeTransaction } from '~data/index';
import {
  getTokenIdFromNFTId,
  SelectedNFT,
  SelectedSafe,
} from '~modules/dashboard/sagas/utils/safeHelpers';
import { AddedActions, Address, ColonyExtendedActions } from '~types/index';
import { getSafeTransactionActionType } from '~utils/colonyActions';

export { validateType, getArrayFromString } from './contractParserValidation';
export {
  getContractUsefulMethods,
  AbiItemExtended,
  fetchContractABI,
  isAbiItem,
  fetchContractName,
} from './getContractUsefulMethods';

export const getSelectedSafeBalance = (
  safeBalances?: SafeBalance[] | null,
  selectedTokenAddress?: Address,
) =>
  safeBalances?.find(
    (balance) =>
      balance.tokenAddress === selectedTokenAddress ||
      (!balance.tokenAddress && selectedTokenAddress === AddressZero),
  );

export const getSelectedNFTData = (
  selectedNFT: SelectedNFT,
  availableNFTs: NftData[],
) =>
  availableNFTs.find((nft) => {
    const tokenId = getTokenIdFromNFTId(selectedNFT.id);
    return (
      nft.address === selectedNFT.profile.walletAddress && nft.id === tokenId
    );
  });

export const getColonySafe = (
  safes: ColonySafe[],
  selectedSafe: SelectedSafe | null,
) => {
  if (!selectedSafe) return undefined;

  return safes.find(
    (safe) =>
      safe.contractAddress === selectedSafe.profile.walletAddress &&
      safe.moduleContractAddress === selectedSafe.id,
  );
};

export const getSafeTransactionActionTypeMessageId = (
  actionType: AddedActions.SafeTransactionInitiated,
  safeTransaction: SafeTransaction[],
) => {
  const type = getSafeTransactionActionType(actionType, safeTransaction);
  switch (type) {
    case TransactionTypes.RAW_TRANSACTION:
      return `action.type.${ColonyExtendedActions.SafeTransactionInitiated}.rawTransaction`;
    case TransactionTypes.TRANSFER_FUNDS:
      return `action.type.${ColonyExtendedActions.SafeTransactionInitiated}.transferFunds`;
    case TransactionTypes.TRANSFER_NFT:
      return `action.type.${ColonyExtendedActions.SafeTransactionInitiated}.transferNFT`;
    case TransactionTypes.CONTRACT_INTERACTION:
      return `action.type.${ColonyExtendedActions.SafeTransactionInitiated}.contractInteraction`;
    case TransactionTypes.MULTIPLE_TRANSACTIONS:
      return `action.type.${ColonyExtendedActions.SafeTransactionInitiated}.multipleTransactions`;
    default:
      return 'action.type';
  }
};
