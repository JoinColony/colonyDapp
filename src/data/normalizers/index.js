/* @flow */

import type { Entry } from '~types';
import { VERSION } from '../constants';

export const CONTRACT_EVENT_SOURCE = 'contract';
export const DDB_EVENT_SOURCE = 'ddb';

opaque type EVENT_SOURCE_TYPE = 'contract' | 'ddb';

type NormalizedEvent = {|
  type: string, // Event type a.k.a event name
  payload: Object, // Orbit-db entry payload value or parsed tx log topics
  meta: {|
    id: string, // Orbit payload id or txHash_logIndex for tx logs
    sourceId: string, // Orbit store address or contract address
    sourceType: EVENT_SOURCE_TYPE, // See above
    actorId: string, // Wallet address for orbit-db events or tx sender address for tx logs
    timestamp: number,
    version: typeof VERSION,
  |},
|};

type TransactionLog = {|
  event: { eventName: string },
  log: {
    address: string,
    logIndex: number,
    transactionHash: string,
  },
  timestamp: number,
  transaction: {
    from: string,
  },
|};

opaque type EventNormalizerFn = (
  event: TransactionLog | Entry,
) => NormalizedEvent;

export const normalizeDDBStoreEvent: EventNormalizerFn = ({
  id: storeAddress,
  identity: { id: actorId },
  payload: {
    type,
    value: args,
    meta: { timestamp, id },
  },
}: Entry) => ({
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

export const normalizeTransactionLog: EventNormalizerFn = ({
  event: { eventName: type, ...args },
  log: { address, logIndex, transactionHash },
  timestamp,
  transaction: { from },
}) => ({
  type,
  payload: args,
  meta: {
    id: `${transactionHash}_${logIndex}`,
    sourceType: CONTRACT_EVENT_SOURCE,
    sourceId: address,
    actorId: from,
    timestamp,
    version: VERSION,
  },
});

export const normalizeEvent = (eventSourceType: string): EventNormalizerFn =>
  ({
    CONTRACT_EVENT_SOURCE: normalizeTransactionLog,
    DDB_EVENT_SOURCE: normalizeDDBStoreEvent,
  }[eventSourceType]);
