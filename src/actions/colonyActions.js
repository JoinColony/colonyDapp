// @flow
import { RETURN_COLONY } from './actionConstants';

import type { Action } from './actionConstants';

// loads colony database into redux
export function loadColony(colonyId: string): Action {
  return {
    type: RETURN_COLONY,
    payload: { colonyId },
  };
}

// creates colony database with given info, puts in redux
export function createColony() {}

/*
Changes simple properties: name, any other simple property cached here
Call with { property, value }
*/
export function editColony() {}

export function storeColonyAvatarOnIPFS() {}

// grant permissions to user via smart contract
export function setUserAsAdmin() {}

// grant permissions to user via smart contract
export function setUserAsMember() {}
