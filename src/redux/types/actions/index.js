/* @flow */

// eslint-disable-next-line no-unused-vars
import type { ActionType, $Pick } from '~types';

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
