/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars, class-methods-use-this */

import { Address, Entry, createAddress } from '~types/index';
import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';
import { log } from '../../utils/debug';

const TYPE = 'eth-wallet/purser';

class EthereumWalletAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>
> {
  private readonly walletAddress: Address;

  static get type() {
    return TYPE;
  }

  get type() {
    return EthereumWalletAccessController.type;
  }

  constructor(walletAddress: Address) {
    super();
    log.verbose('Instantiating wallet access controller', walletAddress);
    this.walletAddress = walletAddress;
  }

  async canAppend(
    entry: Entry,
    provider: PurserIdentityProvider<PurserIdentity>,
  ): Promise<boolean> {
    const {
      identity: { id: walletAddress },
    } = entry;

    log.verbose(`Checking permission for wallet: "${walletAddress}"`);

    // This is only necessary for the EthereumWalletAccessController
    if (createAddress(walletAddress) !== this.walletAddress) return false;

    return super.canAppend(entry, provider);
  }

  async save() {
    const accessControllerAddress = `/ethereum_account/${this.walletAddress}`;
    log.verbose(`Access controller address: "${accessControllerAddress}"`);
    return accessControllerAddress;
  }

  async grant(actionId: string, address: Address): Promise<boolean> {
    throw new Error(
      'The wallet owner is the only one allowed to write to this database',
    );
  }

  async revoke(actionId: string, address: Address): Promise<boolean> {
    throw new Error(
      'The wallet owner is the only one allowed to write to this database',
    );
  }
}

export default EthereumWalletAccessController;
