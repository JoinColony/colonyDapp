import { Record } from 'immutable';

import { DefaultValues } from '~types/index';

export interface NetworkProps {
  /*
   * Current network fee, calculated using `feeInverse`.
   * If the current fee is 1%, this will be `.01`.
   */
  fee?: number;

  /*
   * Network fee inverse as defined by the ColonyNetwork contract.
   * If the current fee is 1%, this will be `100`.
   */
  feeInverse?: number;
  version?: number;
}

const defaultValues: DefaultValues<NetworkProps> = {
  fee: undefined,
  feeInverse: undefined,
  version: undefined,
};

export class NetworkRecord extends Record<NetworkProps>(defaultValues) {}

export const Network = (p?: NetworkProps) => new NetworkRecord(p);
