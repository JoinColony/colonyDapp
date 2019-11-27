import { ColonyActionTypes } from './colony';
import { ConnectionActionTypes } from './connection';
import { DomainActionTypes } from './domain';
import { GasPricesActionTypes } from './gasPrices';
import { InboxActionTypes } from './inbox';
import { IpfsActionTypes } from './ipfs';
import { MultisigActionTypes } from './multisig';
import { NetworkActionTypes } from './network';
import { PersistActionTypes } from '../../persist';
import { TaskActionTypes } from './task';
import { TokenActionTypes } from './token';
import { TransactionActionTypes } from './transaction';
import { MessageActionTypes } from './message';
import { UserActionTypes } from './user';
import { InboxItemsActionTypes } from './inboxItems';
import { UsernameActionTypes } from './username';
import { WalletActionTypes } from './wallet';

/*
 * Type that represents an action (bare minimum).
 *
 * T: the action type, e.g. `COLONY_CREATE`
 */
export interface ActionType<T extends string> {
  type: T;
}

/*
 * Type that represents an action with a `payload` property.
 *
 * P: the action payload, e.g. `{| tokenAddress: string |}`
 * M: any additional `meta` properties, e.g. `key: *`
 */
export interface ActionTypeWithPayload<T extends string, P>
  extends ActionType<T> {
  type: T;
  payload: P;
}

/*
 * Type that represents an action with a `meta` property.
 *
 * M: any additional `meta` properties, e.g. `key: *`
 */
export interface ActionTypeWithMeta<T extends string, M extends {}>
  extends ActionType<T> {
  type: T;
  meta: M;
}

/*
 * Type that represents an action with `payload` and `meta` properties.
 *
 * P: the action payload, e.g. `{| tokenAddress: string |}`
 * M: any additional `meta` properties, e.g. `key: *`
 */
export interface ActionTypeWithPayloadAndMeta<
  T extends string,
  P,
  M extends {}
> extends ActionType<T> {
  type: T;
  meta: M;
  payload: P;
}

/*
 * Type that represents a unique action (e.g. from `ActionForm`).
 */
export interface UniqueActionType<T extends string, P, M> {
  type: T;
  payload: P;
  meta: {
    id: string;
  } & M;
}

/*
 * Type that represents a unique action without a payload
 */
export interface UniqueActionTypeWithoutPayload<T extends string, M> {
  type: T;
  meta: {
    id: string;
  } & M;
}

/*
 * Type that represents an error action.
 */
export interface ErrorActionType<T extends string, M>
  extends ActionTypeWithPayloadAndMeta<T, Error, M> {
  error: true;
}

/*
 * This is the type that contains ALL of our actions in the app.
 */
export type AllActions =
  | ColonyActionTypes
  | ConnectionActionTypes
  | DomainActionTypes
  | GasPricesActionTypes
  | InboxActionTypes
  | IpfsActionTypes
  | MultisigActionTypes
  | NetworkActionTypes
  | PersistActionTypes
  | TaskActionTypes
  | TokenActionTypes
  | TransactionActionTypes
  | MessageActionTypes
  | UserActionTypes
  | InboxItemsActionTypes
  | UsernameActionTypes
  | WalletActionTypes;

export type Action<T extends AllActions['type']> = Extract<
  AllActions,
  { type: T }
>;

export type ActionTypeString = AllActions['type'];

export type TakeFilter = (action: AllActions) => boolean;
