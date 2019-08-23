import { RecordOf, Record } from 'immutable';

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

const defaultValues: NetworkProps = {
  fee: undefined,
  feeInverse: undefined,
  version: undefined,
};

export const NetworkRecord: Record.Factory<NetworkProps> = Record(
  defaultValues,
);

export type NetworkRecordType = RecordOf<NetworkProps>;
