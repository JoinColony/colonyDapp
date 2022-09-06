import { AddressZero } from 'ethers/constants';

import { SafeBalance } from '~dashboard/Dialogs/ControlSafeDialog/ControlSafeDialog';
import { ColonySafe, NftData } from '~data/index';
import {
  getIdFromNFTDisplayName,
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
  availableNFTs: NftData[],
) =>
  availableNFTs.find((nft) => {
    const id = getIdFromNFTDisplayName(selectedNFT.profile.displayName);
    return nft.address === selectedNFT.profile.walletAddress && nft.id === id;
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
