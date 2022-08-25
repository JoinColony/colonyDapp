import { Address } from '~types/index';
import { NFT } from '../ControlSafeForm';

export const getFilteredNFTData = (nftCatalogue: NFT[], address: Address) =>
  nftCatalogue.find((item) => item?.address === address);
