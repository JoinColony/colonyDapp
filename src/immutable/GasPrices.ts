import BigNumber from 'bn.js';
import { Record } from 'immutable';

import { DefaultValues, RecordToJS } from '~types/index';

export interface GasPricesProps {
  cheaper?: BigNumber;
  cheaperWait?: number;
  faster?: BigNumber;
  fasterWait?: number;
  network?: BigNumber;
  suggested?: BigNumber;
  suggestedWait?: number;
  timestamp?: number;
}

const defaultValues: DefaultValues<GasPricesProps> = {
  cheaper: undefined,
  cheaperWait: undefined,
  faster: undefined,
  fasterWait: undefined,
  network: undefined,
  suggested: undefined,
  suggestedWait: undefined,
  timestamp: undefined,
};

export class GasPricesRecord extends Record<GasPricesProps>(defaultValues)
  implements RecordToJS<GasPricesProps> {}

export const GasPrices = (p?: GasPricesProps) => new GasPricesRecord(p);
