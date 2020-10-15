import { Record } from 'immutable';

import { Address, DefaultValues, RecordToJS } from '~types/index';

export enum WalletMethod {
  Create = 'Create',
  Ethereal = 'Ethereal',
  Ganache = 'Ganache',
  /**
   * @NOTE Metamask and Ethereal are the only two wallet categories
   * that are a specific type as well
   */
  MetaMask = 'MetaMask',
}

export enum WalletKind {
  MetaMask = 'MetaMask',
  Ethereal = 'Ethereal',
}

export interface WalletProps {
  currentAddress?: Address;
  isLoading?: boolean;
  walletType?: WalletMethod;
}

export type WalletType = Readonly<WalletProps>;

const defaultValues: DefaultValues<WalletProps> = {
  currentAddress: undefined,
  isLoading: false,
  walletType: WalletMethod.Create,
};

export class WalletRecord extends Record<WalletProps>(defaultValues)
  implements RecordToJS<WalletType> {}

export const Wallet = (p?: WalletProps) => new WalletRecord(p);
