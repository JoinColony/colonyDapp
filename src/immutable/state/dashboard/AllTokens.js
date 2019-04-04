/* @flow */

import type { Map as ImmutableMapType, RecordOf } from 'immutable';

import type { Address } from '~types';
import type { TokenRecordType } from '~immutable';

export type AllTokensMap = ImmutableMapType<Address, TokenRecordType>;

export type AllTokensProps = {|
  tokens: AllTokensMap,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type AllTokensRecord = RecordOf<AllTokensProps>;
