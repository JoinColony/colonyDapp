/* @flow */

import type { Map as ImmutableMapType } from 'immutable';

import type { Address } from '~types';
import type { DataRecordType, TokenRecordType } from '~immutable';

export type AllTokensMap = ImmutableMapType<
  Address,
  DataRecordType<TokenRecordType>,
>;
