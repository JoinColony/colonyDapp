/* @flow */

/* eslint-disable max-len */

import { List } from 'immutable';

import { TokenRecord } from '~immutable';

import type { TokenRecordType } from '~immutable';

export const ETHToken = TokenRecord({
  // $FlowFixMe
  address: '0x0',
  name: 'Ether',
  symbol: 'ETH',
});

export const COOLToken = TokenRecord({
  // $FlowFixMe
  address: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
  name: 'CoolToken',
  symbol: 'COOL',
});

export const DAIToken = TokenRecord({
  // $FlowFixMe
  address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  name: 'DAI',
  symbol: 'DAI',
});

export const CLNYToken = TokenRecord({
  // $FlowFixMe
  address: '0x06441deaf11d60d77e5e42d4f644c64ca05c2fce',
  name: 'Colony',
  symbol: 'CLNY',
});

const mockTokens: List<TokenRecordType> = List.of(ETHToken, CLNYToken);

export default mockTokens;
