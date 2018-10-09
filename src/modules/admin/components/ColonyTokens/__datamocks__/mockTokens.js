/* @flow */

import type { Token } from '../types';

const mockTokens: Array<Token> = [
  {
    id: 4,
    tokenSymbol: 'GNT',
    balance: 5.55,
    icon: 'someIconValue',
    isNative: false,
  },
  {
    id: 1,
    tokenSymbol: 'ETH',
    balance: 0.6123154,
    icon: 'someIconValue',
    isNative: false,
  },
  {
    id: 2,
    tokenSymbol: 'CLNY',
    balance: 22.154,
    icon: 'someIconValue',
    isNative: true,
  },
  {
    id: 5,
    tokenSymbol: 'SNT',
    balance: 2.1415,
    icon: 'someIconValue',
    isNative: false,
  },
  {
    id: 3,
    tokenSymbol: '0x',
    balance: 0.1254,
    icon: 'someIconValue',
    isNative: false,
  },
];

export default mockTokens;
