import { BigNumber } from 'ethers/utils';
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
  /**
   * On xdai the gas price of 1 gwei will always work, so for now, we're setting it manually
   */
  fixed?: BigNumber;
  fixedWait?: number;
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
  /**
   * 1 Gwei converted into wei
   */
  fixed: new BigNumber('1000000000'),
  fixedWait: 5,
  timestamp: undefined,
};

export class GasPricesRecord extends Record<GasPricesProps>(defaultValues)
  implements RecordToJS<GasPricesProps> {}

export const GasPrices = (p?: GasPricesProps) => new GasPricesRecord(p);
