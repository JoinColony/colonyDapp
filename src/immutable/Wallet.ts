import { Record } from 'immutable';

import { Address, DefaultValues, RecordToJS } from '~types/index';

export enum WALLET_CATEGORIES {
  SOFTWARE = 'software',
  HARDWARE = 'hardware',
  /**
   * @NOTE Metamask and Ethereal are the only two wallet categories
   * that are a specific type as well
   */
  METAMASK = 'metamask',
  ETHEREAL = 'ethereal', // ie: temprorary wallet for non-connected users
}

export enum WALLET_SPECIFICS {
  MNEMONIC = 'mnemonic',
  TREZOR = 'trezor',
  LEDGER = 'ledger',
  METAMASK = 'metamask',
  ETHEREAL = 'ethereal', // ie: temprorary wallet for non-connected users

  /**
   * @NOTE Dev Only
   */
  TRUFFLEPIG = 'trufflepig',
}

export interface WalletProps {
  availableAddresses?: Address[];
  currentAddress?: Address;
  isLoading?: boolean;
  walletType?: WALLET_CATEGORIES;
}

export type WalletType = Readonly<WalletProps>;

const defaultValues: DefaultValues<WalletProps> = {
  availableAddresses: [],
  currentAddress: undefined,
  isLoading: false,
  walletType: WALLET_CATEGORIES.SOFTWARE,
};

export class WalletRecord extends Record<WalletProps>(defaultValues)
  implements RecordToJS<WalletType> {}

export const Wallet = (p?: WalletProps) => new WalletRecord(p);
