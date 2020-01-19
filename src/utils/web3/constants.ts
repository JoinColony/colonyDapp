import { createAddress } from '~types/index';

export const ZERO_ADDRESS = createAddress(
  '0x0000000000000000000000000000000000000000',
);

export const ETHER_INFO = Object.freeze({
  id: ZERO_ADDRESS,
  address: ZERO_ADDRESS,
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
  verified: true,
  iconHash: '',
});
