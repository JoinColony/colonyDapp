import { WalletObjectType } from '@colony/purser-core';

import { transformEntry } from '~data/utils';

import {
  Address,
  Entry,
  PermissionsManifest,
  createAddress,
} from '../../types/index';
import { log } from '../../utils/debug';
import { PermissionManager } from '../permissions';
import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

const TYPE = 'eth-contract/colony/purser';

class ColonyAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>
> {
  private readonly colonyAddress: string;

  private readonly manager: PermissionManager;

  private readonly wallet: WalletObjectType;

  static get type(): string {
    return TYPE;
  }

  // eslint-disable-next-line class-methods-use-this
  get type(): string {
    return ColonyAccessController.type;
  }

  constructor(
    colonyAddress: string,
    purserWallet: WalletObjectType,
    permissionsManifest: PermissionsManifest<any>,
  ) {
    super();

    log.verbose(
      'Instantiating colony access controller',
      colonyAddress,
      purserWallet.address,
    );
    this.colonyAddress = colonyAddress;
    this.wallet = purserWallet;
    this.manager = new PermissionManager(permissionsManifest);
  }

  get walletAddress() {
    return createAddress(this.wallet.address);
  }

  private extendVerifyContext<C extends object | void>(
    context: C & { event?: Record<string, any> },
  ): C & { colonyAddress: Address; domainId: number } {
    let domainId;
    if (
      context &&
      context.event &&
      context.event.payload &&
      'domainId' in context.event.payload
    ) {
      domainId = context.event.payload.domainId;
    }
    return {
      ...context,
      colonyAddress: this.colonyAddress,
      domainId,
    };
  }

  private checkWalletAddress() {
    if (!this.wallet.address)
      throw new Error('Could not get wallet address. Is it unlocked?');
  }

  async save({ onlyDetermineAddress }: { onlyDetermineAddress: boolean }) {
    if (!onlyDetermineAddress) {
      const isAllowed = await this.can('is-root', this.walletAddress, {});
      if (!isAllowed) {
        throw new Error('Cannot create colony database, user not allowed');
      }
    }

    const accessControllerAddress = `/colony/${this.colonyAddress}`;
    log.verbose(`Access controller address: "${accessControllerAddress}"`);
    return accessControllerAddress;
  }

  async load() {
    this.checkWalletAddress();
  }

  async canAppend(
    entry: Entry,
    provider: PurserIdentityProvider<PurserIdentity>,
  ): Promise<boolean> {
    const isAuthorized = await super.canAppend(entry, provider);
    if (!isAuthorized) return false;

    const event = transformEntry(entry) as Record<string, any>;
    return this.can(event.type, event.meta.userAddress, { event });
  }

  async can<C extends object | void>(
    actionId: string,
    user: string,
    context: C & { event?: Record<string, any> },
  ): Promise<boolean> {
    log.verbose('Checking permission for action', actionId, user, context);
    return this.manager.can(
      actionId,
      user,
      this.extendVerifyContext<C>(context),
    );
  }
}

export default ColonyAccessController;
