// @flow
import { UPDATE_COLONY, FETCH_COLONY, LOAD_COLONY } from './constants';

import type { Action } from './actionConstants';

// loads colony database into redux
export function fetchColony(colonyId: string): Action {
  return {
    type: FETCH_COLONY,
    payload: { colonyId },
  };
}

export function loadColony(colonyId, colony): Action {
  return { type: LOAD_COLONY, payload: { colonyId, colony } };
}

export function updateColony(colonyId, update): Action {
  return {
    type: UPDATE_COLONY,
    payload: { colonyId, update },
  };
}

export function storeColonyAvatarOnIPFS() {}

// grant permissions to user via smart contract
export function setUserAsAdmin() {}

// grant permissions to user via smart contract
export function setUserAsMember() {}
