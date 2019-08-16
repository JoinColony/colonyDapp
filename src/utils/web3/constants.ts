import { createAddress } from '~types/index';

export const ZERO_ADDRESS = createAddress(
  '0x0000000000000000000000000000000000000000',
);

export const ETHER_INFO = Object.freeze({
  tokenAddress: ZERO_ADDRESS,
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
});
