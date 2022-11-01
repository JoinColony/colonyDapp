import { AddressZero } from 'ethers/constants';

import { SafeBalance } from '~dashboard/Dialogs/ControlSafeDialog/ControlSafeDialog';
import { NFT } from '~dashboard/Dialogs/ControlSafeDialog/TransactionTypesSection/TransferNFTSection';
import { ColonySafe } from '~data/generated';
import {
  getTokenIdFromNFTId,
  SelectedNFT,
  SelectedSafe,
} from '~modules/dashboard/sagas/utils/safeHelpers';
import { Address } from '~types/index';

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
  availableNFTs: NFT[],
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