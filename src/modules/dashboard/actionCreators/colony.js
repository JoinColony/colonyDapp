/* @flow */

import type { Address, ENSName } from '~types';
import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const fetchColony = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_FETCH> => ({
  type: ACTIONS.COLONY_FETCH,
  payload: { colonyAddress },
  meta: { keyPath: [colonyAddress] },
});

export const fetchColonyAddress = (
  colonyName: ENSName,
): Action<typeof ACTIONS.COLONY_ADDRESS_FETCH> => ({
  type: ACTIONS.COLONY_ADDRESS_FETCH,
  payload: { colonyName },
  meta: { keyPath: [colonyName] },
});

export const fetchColonyName = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_NAME_FETCH> => ({
  type: ACTIONS.COLONY_NAME_FETCH,
  payload: { colonyAddress },
  meta: { keyPath: [colonyAddress] },
});

export const fetchColonyTaskMetadata = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_TASK_METADATA_FETCH> => ({
  type: ACTIONS.COLONY_TASK_METADATA_FETCH,
  payload: { colonyAddress },
  meta: { keyPath: [colonyAddress] },
});
