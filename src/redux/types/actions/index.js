/* @flow */

// eslint-disable-next-line no-unused-vars
import type { $Pick } from '~types';

// eslint-disable-next-line no-unused-vars
import { ACTIONS } from '../../index';

import type { ColonyActionTypes } from './colony';
import type { CurrentUserActionTypes } from './currentUser';
import type { DomainActionTypes } from './domain';
import type { GasPricesActionTypes } from './gasPrices';
import type { MultisigActionTypes } from './multisig';
import type { TaskActionTypes } from './task';
import type { TokenActionTypes } from './token';
import type { TransactionActionTypes } from './transaction';
import type { UserActionTypes } from './user';
import type { UserActivitiesActionTypes } from './userActivities';
import type { UsernameActionTypes } from './username';
import type { WalletActionTypes } from './wallet';

/*
 * Sealed object type that represents an action.
 *
 * T: the action type, e.g. `COLONY_CREATE`
 * P: the action payload, e.g. `{| tokenAddress: string |}`
 * M: any additional `meta` properties, e.g. `keyPath: [*]`
 */
export type ActionType<T, P, M> = {|
  type: T,
  payload: P,
  meta: M,
|};

export type UniqueActionType<T, P, M> = ActionType<
  T,
  P,
  {| ...M, id: string |},
>;

export type ErrorActionType<T, M> = {|
  ...ActionType<T, Error, M>,
  error: true,
|};

/*
 * This is the type that contains ALL of our actions in the app.
 */
export type ActionsType = {|
  ...ColonyActionTypes,
  ...CurrentUserActionTypes,
  ...DomainActionTypes,
  ...GasPricesActionTypes,
  ...MultisigActionTypes,
  ...TaskActionTypes,
  ...TokenActionTypes,
  ...TransactionActionTypes,
  ...UserActionTypes,
  ...UserActivitiesActionTypes,
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

export type TakeFilter = (action: ActionType<*, *, *>) => boolean;

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
