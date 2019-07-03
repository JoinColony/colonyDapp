/* @flow */

import type { Event } from '../types';
import { VERSION } from '../constants';

export const CONTRACT_EVENT_SOURCE = 'contract';
export const DDB_EVENT_SOURCE = 'ddb';
// const GITHUB_SOURCE_TYPE
// const OTHER_3RD_PARTY_SOURCE_TYPE

opaque type EVENT_SOURCE_TYPES = CONTRACT_EVENT_SOURCE | DDB_EVENT_SOURCE;

type NormalizedEvent<P: Object> = {|
  type: string, // Event type a.k.a event name
  payload: P, // Orbit-db entry payload value or parsed tx log topics
  meta: {|
    id: string, // Orbit payload id or txHash_logIndex for tx logs
    sourceId: string, // Orbit store address or log transaction hash
    sourceType: EVENT_SOURCE_TYPE, // See above
    actorId: string, // Wallet address for orbit-db events or tx sender address for tx logs
    timestamp: number,
    version: string,
  |},
|};

type TransactionLog<P> = {|
  event: { eventName: string } & P,
  log: {
    logIndex: number,
    transactionHash: string,
  },
  timestamp: number,
  transaction: {
    from: string,
  },
|};

export const normalizeDDBStoreEvent = <P>(
  storeAddress: string,
  {
    identity: { id: actorId },
    payload: {
      type,
      value: args,
      meta: { timestamp, id },
    },
  }: Event<P>,
): NormalizedEvent<P> => ({
  type,
  payload: args,
  meta: {
    id,
    sourceType: DDB_EVENT_SOURCE,
    sourceId: storeAddress,
    actorId,
    timestamp,
    version: VERSION,
  },
});

export const normalizeTransactionLog = <P>(
  contractAddress: string,
  {
    event: { eventName: type, ...args },
    log: { logIndex, transactionHash },
    timestamp,
    transaction: { from },
  }: TransactionLog<P>,
): NormalizedEvent<P> => ({
  type,
  payload: args,
  meta: {
    id: `${transactionHash}_${logIndex}`,
    sourceType: CONTRACT_EVENT_SOURCE,
    sourceId: contractAddress,
    actorId: from,
    timestamp,
    version: VERSION,
  },
});

export const normalizeEvent = <P>(
  eventSourceType: string,
): ((
  eventSourceId: string,
  data: TransactionLog<P> | Event<P>,
) => NormalizedEvent<P>) =>
  ({
    CONTRACT_EVENT_SOURCE: normalizeTransactionLog,
    DDB_EVENT_SOURCE: normalizeDDBStoreEvent,
  }[eventSourceType]);
