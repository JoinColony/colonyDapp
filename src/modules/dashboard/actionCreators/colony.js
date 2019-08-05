/* @flow */

import type { Address, ENSName } from '~types';
import type { Action } from '~redux';

import { createAddress } from '~types';
import { ACTIONS } from '~redux';

export const fetchColony = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_FETCH> => ({
  type: ACTIONS.COLONY_FETCH,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});

export const fetchColonyAddress = (
  colonyName: ENSName,
): Action<typeof ACTIONS.COLONY_ADDRESS_FETCH> => ({
  type: ACTIONS.COLONY_ADDRESS_FETCH,
  payload: { colonyName },
  meta: { key: colonyName },
});

export const fetchColonyName = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_NAME_FETCH> => ({
  type: ACTIONS.COLONY_NAME_FETCH,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});

export const fetchColonyTaskMetadata = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_TASK_METADATA_FETCH> => ({
  type: ACTIONS.COLONY_TASK_METADATA_FETCH,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});

export const fetchColonyTokenBalance = (
  colonyAddress: Address,
  tokenAddress: Address,
): Action<typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH> => ({
  type: ACTIONS.COLONY_TOKEN_BALANCE_FETCH,
  payload: { colonyAddress, tokenAddress },
});

export const fetchColonyCanMintNativeToken = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH> => ({
  type: ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});

export const colonySubStart = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_SUB_START> => ({
  type: ACTIONS.COLONY_SUB_START,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});

export const colonySubStop = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_SUB_STOP> => ({
  type: ACTIONS.COLONY_SUB_STOP,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});

export const colonyTaskMetadataSubStart = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_TASK_METADATA_SUB_START> => ({
  type: ACTIONS.COLONY_TASK_METADATA_SUB_START,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});

export const colonyTaskMetadataSubStop = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_TASK_METADATA_SUB_STOP> => ({
  type: ACTIONS.COLONY_TASK_METADATA_SUB_STOP,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});
