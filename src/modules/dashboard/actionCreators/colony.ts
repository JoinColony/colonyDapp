import { Address, ENSName, createAddress } from '~types/index';
import { AllActions, ActionTypes } from '~redux/index';

export const fetchColony = (colonyAddress: Address): AllActions => ({
  type: ActionTypes.COLONY_FETCH,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});

export const fetchColonyAddress = (colonyName: ENSName): AllActions => ({
  type: ActionTypes.COLONY_ADDRESS_FETCH,
  payload: { colonyName },
  meta: { key: colonyName },
});

export const fetchColonyName = (colonyAddress: Address): AllActions => ({
  type: ActionTypes.COLONY_NAME_FETCH,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});

export const fetchColonyTaskMetadata = (
  colonyAddress: Address,
): AllActions => ({
  type: ActionTypes.COLONY_TASK_METADATA_FETCH,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});

export const fetchColonyTokenBalance = (
  colonyAddress: Address,
  tokenAddress: Address,
  domainId: number,
): AllActions => ({
  type: ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
  payload: { colonyAddress, domainId, tokenAddress },
});

export const fetchColonyTokenBalances = (
  colonyAddress: Address,
  tokenAddress: Address,
): AllActions => ({
  type: ActionTypes.COLONY_TOKEN_BALANCES_FETCH,
  payload: { colonyAddress, tokenAddress },
});

export const colonyTaskMetadataSubStart = (
  colonyAddress: Address,
): AllActions => ({
  type: ActionTypes.COLONY_TASK_METADATA_SUB_START,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});

export const colonyTaskMetadataSubStop = (
  colonyAddress: Address,
): AllActions => ({
  type: ActionTypes.COLONY_TASK_METADATA_SUB_STOP,
  payload: { colonyAddress },
  meta: { key: createAddress(colonyAddress) },
});
