// @flow

import {
  ADD_DOMAIN_TO_COLONY,
  ADD_TASK_TO_DOMAIN,
  EDIT_DOMAIN,
  RETURN_DOMAIN,
} from './constants';

import type { Action } from './actionConstants';

// create domain database, add hash to colony domains list
export function addDomainToColony(colonyId: string, domainId: string): Action {
  return {
    type: ADD_DOMAIN_TO_COLONY,
    payload: { colonyId, domainId },
  };
}

/*
Changes simple properties: name, color
Call with { property, value }
*/
export function editDomain(domainId, update): Action {
  return {
    type: EDIT_DOMAIN,
    payload: { domainId, update },
  };
}

export function loadDomain(domainId: string): Action {
  return {
    type: RETURN_DOMAIN,
    payload: { domainId },
  };
}

// grant permissions to user via smart contract
export function addUserToDomain() {}

export function addTaskToDomain(domainId: string, task: any): Action {
  return {
    type: ADD_TASK_TO_DOMAIN,
    payload: { domainId, task },
  };
}
