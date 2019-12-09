import { Versions } from '../constants';
import { EVENT_SOURCE_TYPES } from '../types/index';

interface NormalizedEvent {
  type: string; // Event type a.k.a event name
  payload: object | null; // Orbit-db entry payload value or parsed tx log topics
  meta: {
    id: string; // Orbit payload id or txHash_logIndex for tx logs
    sourceId: string; // Orbit store address or contract address
    sourceType: EVENT_SOURCE_TYPES; // See above
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
    sourceType: EVENT_SOURCE_TYPES.CONTRACT,
    sourceId: contractAddress,
    actorId: from,
    timestamp,
    version: Versions.CURRENT,
  },
});
