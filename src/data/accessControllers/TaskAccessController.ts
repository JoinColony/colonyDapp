import { transformEntry } from '~data/utils';
import { TaskEvents } from '~data/types/TaskEvents';

import {
  Entry,
  PermissionsManifest,
  createAddress,
  Address,
} from '../../types/index';
import { PermissionManager } from '../permissions';
import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

import { log } from '../../utils/debug';

const TYPE = 'eth-contract/colony/task/purser';

type WalletObjectType = any;

class TaskAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>
> {
  private readonly draftId: string;

  private readonly colonyAddress: Address;

  private readonly domainId: number;

  private readonly manager: PermissionManager;

  private readonly wallet: WalletObjectType;

  static get type() {
    return TYPE;
  }

  // eslint-disable-next-line class-methods-use-this
  get type() {
    return TaskAccessController.type;
  }

  constructor(
    draftId: string,
    colonyAddress: string,
    domainId: number,
    wallet: WalletObjectType,
    permissionsManifest: PermissionsManifest<any>,
  ) {
    super();
    this.draftId = draftId;
    this.colonyAddress = colonyAddress;
    this.wallet = wallet;
    this.domainId = domainId;

    log.verbose(
      'Instantiating task access controller',
      colonyAddress,
      draftId,
      domainId,
      wallet.address,
    );

    this.manager = new PermissionManager(permissionsManifest);
  }

  get walletAddress() {
    return createAddress(this.wallet.address);
  }

  private extendVerifyContext<C extends object | void>(
    context: C & { event?: TaskEvents },
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
      domainId: this.domainId || domainId,
    };
  }

  private checkWalletAddress() {
    if (!this.wallet.address)
      throw new Error('Could not get wallet address. Is it unlocked?');
  }

  async save({ onlyDetermineAddress }: { onlyDetermineAddress: boolean }) {
    if (!onlyDetermineAddress) {
      if (!this.domainId) {
        throw new Error(
          'TaskAccessController must be initialized with a domain ID to save',
        );
      }

      const isAllowed = await this.can('is-admin', this.walletAddress, {
        domainId: this.domainId,
      });
      if (!isAllowed) {
        throw new Error('Cannot create task database, user not allowed');
      }
    }

    const accessControllerAddress = `/colony/${this.colonyAddress}/task/${this.draftId}`;
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

    const event = transformEntry(entry) as TaskEvents;
    return this.can(event.type, event.meta.userAddress, { event });
  }

  async can<C extends object | void>(
    actionId: string,
    user: string,
    context: C & { event?: TaskEvents },
  ): Promise<boolean> {
    log.verbose('Checking permission for action', actionId, user, context);
    return this.manager.can(
      actionId,
      user,
      this.extendVerifyContext<C>(context),
    );
  }
}

export default TaskAccessController;
