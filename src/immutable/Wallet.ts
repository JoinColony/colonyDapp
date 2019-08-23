import { $Values, $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import { Address } from '~types/index';

export const WALLET_CATEGORIES = Object.freeze({
  SOFTWARE: 'software',
  HARDWARE: 'hardware',

  /**
   * @NOTE Metamask is a wallet category as well as a specific type
   */
  METAMASK: 'metamask',
});

export type WalletCategoryType = $Values<typeof WALLET_CATEGORIES>;

export const WALLET_SPECIFICS = Object.freeze({
  JSON: 'json',
  MNEMONIC: 'mnemonic',
  TREZOR: 'trezor',
  LEDGER: 'ledger',
  METAMASK: 'metamask',

  /**
   * @NOTE Dev Only
   */
  TRUFFLEPIG: 'trufflepig',
});

export type WalletSpecificType = $Values<typeof WALLET_SPECIFICS>;

export interface WalletProps {
  availableAddresses?: Address[];
  currentAddress?: Address;
  isLoading: boolean;
  walletType: WalletCategoryType;
}

export type WalletPropsJS = $ReadOnly<WalletProps>;

export type WalletRecordType = RecordOf<WalletProps>;

const defaultValues: WalletProps = {
  availableAddresses: [],
  currentAddress: undefined,
  isLoading: undefined,
  walletType: WALLET_CATEGORIES.SOFTWARE,
};

export const WalletRecord: Record.Factory<WalletProps> = Record(defaultValues);

export default WalletRecord;
