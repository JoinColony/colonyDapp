import { Record } from 'immutable';

import { Address, DefaultValues, RecordToJS } from '~types/index';

export enum WalletMethod {
  Create = 'Create',
  Ethereal = 'Ethereal',
  Ganache = 'Ganache',
  Ledger = 'Ledger',
  /**
   * @NOTE Metamask and Ethereal are the only two wallet categories
   * that are a specific type as well
   */
  MetaMask = 'MetaMask',
  Mnemonic = 'Mnemonic',
  Trezor = 'Trezor',
}

export enum WalletKind {
  Software = 'Software',
  Hardware = 'Hardware',
  MetaMask = 'MetaMask',
  Ethereal = 'Ethereal',
}

export interface WalletProps {
  availableAddresses?: Address[];
  currentAddress?: Address;
  isLoading?: boolean;
  walletType?: WalletMethod;
}

export type WalletType = Readonly<WalletProps>;

const defaultValues: DefaultValues<WalletProps> = {
  availableAddresses: [],
  currentAddress: undefined,
  isLoading: false,
  walletType: WalletMethod.Create,
};

export class WalletRecord extends Record<WalletProps>(defaultValues)
  implements RecordToJS<WalletType> {}

export const Wallet = (p?: WalletProps) => new WalletRecord(p);
