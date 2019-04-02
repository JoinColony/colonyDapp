/* @flow */

/* eslint-disable max-len */

import { List } from 'immutable';

import { TokenRecord } from '~immutable';

import type { TokenRecordType } from '~immutable';

const mockTokens: List<TokenRecordType> = List.of(
  TokenRecord({
    address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
    name: 'Golem Network Token',
    symbol: 'GNT',
  }),
  TokenRecord({
    address: '0x0',
    name: 'Ether',
    symbol: 'ETH',
  }),
  TokenRecord({
    address: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
    name: 'Status',
    symbol: 'SNT',
  }),
  TokenRecord({
    address: '0x812f35b66ec9eee26cd7fdf07fbc1c9c0ac3c4d6',
    name: '0x Protocol',
    symbol: 'ZRX',
  }),
  TokenRecord({
    address: '0x06441deaf11d60d77e5e42d4f644c64ca05c2fce',
    name: 'Colony',
    symbol: 'CLNY',
  }),
);

export default mockTokens;
