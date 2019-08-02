/* @flow */

// eslint-disable-next-line no-unused-vars
import type { $Pick } from '~types';

// eslint-disable-next-line no-unused-vars
import { ACTIONS } from '../../index';

import type { ColonyActionTypes } from './colony';
import type { ConnectionActionTypes } from './connection';
import type { CurrentUserActionTypes } from './currentUser';
import type { DomainActionTypes } from './domain';
import type { GasPricesActionTypes } from './gasPrices';
import type { InboxActionTypes } from './inbox';
import type { IpfsActionTypes } from './ipfs';
import type { MultisigActionTypes } from './multisig';
import type { NetworkActionTypes } from './network';
import type { PersistActionTypes } from '../../persist';
import type { TaskActionTypes } from './task';
import type { TokenActionTypes } from './token';
import type { TransactionActionTypes } from './transaction';
import type { MessageActionTypes } from './message';
import type { UserActionTypes } from './user';
import type { InboxItemsActionTypes } from './inboxItems';
import type { UsernameActionTypes } from './username';
import type { WalletActionTypes } from './wallet';

/*
 * Type that represents an action (bare minimum).
 *
 * T: the action type, e.g. `COLONY_CREATE`
 */
export type ActionType<T> = {|
  type: T,
|};

/*
 * Type that represents an action with a `payload` property.
 *
 * P: the action payload, e.g. `{| tokenAddress: string |}`
 * M: any additional `meta` properties, e.g. `key: *`
 */
export type ActionTypeWithPayload<T, P> = {| ...ActionType<T>, payload: P |};

/*
 * Type that represents an action with a `meta` property.
 *
 * M: any additional `meta` properties, e.g. `key: *`
 */
export type ActionTypeWithMeta<T, M> = {| ...ActionType<T>, meta: M |};

/*
 * Type that represents an action with `payload` and `meta` properties.
 *
 * P: the action payload, e.g. `{| tokenAddress: string |}`
 * M: any additional `meta` properties, e.g. `key: *`
 */
export type ActionTypeWithPayloadAndMeta<T, P, M> = {|
  ...ActionType<T>,
  meta: M,
  payload: P,
|};

/*
 * Type that represents a unique action (e.g. from `ActionForm`).
 */
export type UniqueActionType<T, P, M> = ActionTypeWithPayloadAndMeta<
  T,
  P,
  {| ...M, id: string |},
>;

/*
 * Type that represents an error action.
 */
export type ErrorActionType<T, M> = {|
  ...ActionTypeWithPayloadAndMeta<T, Error, M>,
  error: true,
|};

/*
 * This is the type that contains ALL of our actions in the app.
 */
export type ActionsType = {|
  ...ColonyActionTypes,
  ...ConnectionActionTypes,
  ...CurrentUserActionTypes,
  ...DomainActionTypes,
  ...GasPricesActionTypes,
  ...InboxActionTypes,
  ...IpfsActionTypes,
  ...MultisigActionTypes,
  ...NetworkActionTypes,
  ...PersistActionTypes,
  ...TaskActionTypes,
  ...TokenActionTypes,
  ...TransactionActionTypes,
  ...MessageActionTypes,
  ...UserActionTypes,
  ...InboxItemsActionTypes,
  ...UsernameActionTypes,
  ...WalletActionTypes,
|};

export type ActionTypeString = $Keys<ActionsType>;

/*
 * Given a string literal `T` representing an action type
 * (e.g. `typeof ACTIONS.COLONY_CREATE`), pick the given action type.
 */
export type Action<T: ActionTypeString> = $ElementType<ActionsType, T>;

export type ActionCreator<T> = (...args: *) => Action<T>;

export type TakeFilter = (action: *) => boolean;

/* eslint-disable */
/*::
// This bit of flow magic tests that ActionsType has coverage for
// everthing in ACTIONS, and also that ActionsType doesn't contain anything
// that ACTIONS doesn't have.
type ActionTypesDiff = $Exact<
  $Diff<$Pick<typeof ACTIONS, ActionsType>, $Exact<typeof ACTIONS>>,
>;
const diff: ActionTypesDiff = Object.freeze({}); // the diff should be empty
 */
/* eslint-enable */
