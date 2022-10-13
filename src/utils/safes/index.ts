import { AddressZero } from 'ethers/constants';

import { SafeBalance } from '~dashboard/Dialogs/ControlSafeDialog/ControlSafeDialog';
import { NFT } from '~dashboard/Dialogs/ControlSafeDialog/TransactionTypesSection/TransferNFTSection';
import {
  getIdFromNFTDisplayName,
  SelectedNFT,
} from '~modules/dashboard/sagas/utils/safeHelpers';
import { Address } from '~types/index';

export { validateType, getArrayFromString } from './contractParserValidation';
export {
  getContractUsefulMethods,
  AbiItemExtended,
  fetchContractABI,
  isAbiItem,
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
    const id = getIdFromNFTDisplayName(selectedNFT.profile.displayName);
    return nft.address === selectedNFT.profile.walletAddress && nft.id === id;
  });
