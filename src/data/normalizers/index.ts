import { Versions } from '../constants';
import { Event } from '../types/index';

export const CONTRACT_EVENT_SOURCE = 'contract';
export const DDB_EVENT_SOURCE = 'ddb';

// This should be opaque
type EVENT_SOURCE_TYPE = 'contract' | 'ddb';

interface NormalizedEvent {
  type: string; // Event type a.k.a event name
  payload: object | null; // Orbit-db entry payload value or parsed tx log topics
  meta: {
    id: string; // Orbit payload id or txHash_logIndex for tx logs
    sourceId: string; // Orbit store address or contract address
    sourceType: EVENT_SOURCE_TYPE; // See above
    actorId: string; // Wallet address for orbit-db events or tx sender address for tx logs
    timestamp: number;
    version: Versions;
  };
}

interface TransactionLog {
  event: { eventName: string };
  log: {
    logIndex: number;
    transactionHash: string;
    address: string;
  };
  timestamp: number;
  transaction: {
    from: string;
  };
}

export const normalizeDDBStoreEvent = (
  storeAddress: string,
  { meta: { timestamp, id, userAddress, version }, payload, type }: Event<any>,
): NormalizedEvent => ({
  type,
  payload,
  meta: {
    id,
    sourceType: DDB_EVENT_SOURCE,
    sourceId: storeAddress,
    actorId: userAddress,
    timestamp,
    version,
  },
});

export const normalizeTransactionLog = (
  contractAddress: string,
  {
    event: { eventName, ...event },
    log: { logIndex, transactionHash, address: tokenAddress, ...log },
    timestamp,
    transaction: { from },
  }: TransactionLog,
): NormalizedEvent => ({
  type: eventName,
  payload: {
    ...log,
    ...event,
    tokenAddress,
  },
  meta: {
    id: `${transactionHash}_${logIndex}`,
    sourceType: CONTRACT_EVENT_SOURCE,
    sourceId: contractAddress,
    actorId: from,
    timestamp,
    version: Versions.CURRENT,
  },
});

export const normalizeEvent = (
  eventSourceType: string,
): ((
  eventSourceId: string,
  data: TransactionLog | Event<any>,
) => NormalizedEvent) =>
  ({
    CONTRACT_EVENT_SOURCE: normalizeTransactionLog,
    DDB_EVENT_SOURCE: normalizeDDBStoreEvent,
  }[eventSourceType]);
