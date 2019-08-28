import { Event } from '../types/index';
import { VERSION } from '../constants';

export const CONTRACT_EVENT_SOURCE = 'contract';
export const DDB_EVENT_SOURCE = 'ddb';

// This should be opaque
type EVENT_SOURCE_TYPE = 'contract' | 'ddb';

type NormalizedEvent = {
  type: string; // Event type a.k.a event name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: object; // Orbit-db entry payload value or parsed tx log topics
  meta: {
    id: string; // Orbit payload id or txHash_logIndex for tx logs
    sourceId: string; // Orbit store address or contract address
    sourceType: EVENT_SOURCE_TYPE; // See above
    actorId: string; // Wallet address for orbit-db events or tx sender address for tx logs
    timestamp: number;
    version: typeof VERSION;
  };
};

type TransactionLog = {
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
};

export const normalizeDDBStoreEvent = (
  storeAddress: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { meta: { timestamp, id, userAddress }, payload, type }: Event<any>,
): NormalizedEvent => ({
  type,
  payload,
  meta: {
    id,
    sourceType: DDB_EVENT_SOURCE,
    sourceId: storeAddress,
    actorId: userAddress,
    timestamp,
    version: VERSION,
  },
});

export const normalizeTransactionLog = (
  contractAddress: string,
  {
    event: { eventName, ...event },
    log: { logIndex, transactionHash, address: tokenAddress },
    timestamp,
    transaction: { from },
  }: TransactionLog,
): NormalizedEvent => ({
  type: eventName,
  payload: {
    ...event,
    tokenAddress,
  },
  meta: {
    id: `${transactionHash}_${logIndex}`,
    sourceType: CONTRACT_EVENT_SOURCE,
    sourceId: contractAddress,
    actorId: from,
    timestamp,
    version: VERSION,
  },
});

export const normalizeEvent = (
  eventSourceType: string,
): ((
  eventSourceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: TransactionLog | Event<any>,
) => NormalizedEvent) =>
  ({
    CONTRACT_EVENT_SOURCE: normalizeTransactionLog,
    DDB_EVENT_SOURCE: normalizeDDBStoreEvent,
  }[eventSourceType]);
