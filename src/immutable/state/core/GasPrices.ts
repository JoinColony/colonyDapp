import BigNumber from 'bn.js';
import { RecordOf, Record } from 'immutable';

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

const defaultValues: Partial<GasPricesProps> = {
  cheaper: undefined,
  cheaperWait: undefined,
  faster: undefined,
  fasterWait: undefined,
  network: undefined,
  suggested: undefined,
  suggestedWait: undefined,
  timestamp: undefined,
};

export const GasPrices: Record.Factory<Partial<GasPricesProps>> = Record(
  defaultValues,
);

export type GasPricesRecord = RecordOf<GasPricesProps>;
