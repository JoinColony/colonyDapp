/* @flow */

import type BigNumber from 'bn.js';
import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

export type GasPricesProps = {
  cheaper?: BigNumber,
  cheaperWait?: number,
  faster?: BigNumber,
  fasterWait?: number,
  network?: BigNumber,
  suggested?: BigNumber,
  suggestedWait?: number,
  timestamp?: number,
};

const defaultValues: $Shape<GasPricesProps> = {
  cheaper: undefined,
  cheaperWait: undefined,
  faster: undefined,
  fasterWait: undefined,
  network: undefined,
  suggested: undefined,
  suggestedWait: undefined,
  timestamp: undefined,
};

const GasPrices: RecordFactory<GasPricesProps> = Record(defaultValues);

export type GasPricesRecord = RecordOf<GasPricesProps>;

export default GasPrices;
