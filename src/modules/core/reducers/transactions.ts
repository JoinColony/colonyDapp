import getObjectFromPath from 'lodash/get';

import {
  TransactionRecord,
  Transaction,
  TRANSACTION_STATUSES,
  TransactionRecordProps,
} from '~immutable/index';
import { ActionTypes, ReducerType } from '~redux/index';

import { CoreTransactions, CoreTransactionsRecord } from '../state/index';
import { CORE_TRANSACTIONS_LIST } from '../constants';

const transactionGroup = (tx: TransactionRecord) => {
  if (!tx.group || typeof tx.group.id === 'string') return tx.group;
  const id = tx.group.id.reduce(
    (resultId, entry) => `${resultId}-${getObjectFromPath(tx, entry)}`,
    tx.group.key,
  );
  return {
    ...tx.group,
    id,
  };
};

const coreTransactionsReducer: ReducerType<CoreTransactionsRecord> = (
  state = CoreTransactions(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.TRANSACTION_CREATED:
    case ActionTypes.MULTISIG_TRANSACTION_CREATED: {
      const {
        meta: { id },
        payload: {
          context,
          createdAt,
          from,
          group,
          identifier,
          methodContext,
          methodName,
          multisig,
          options,
          params,
          status,
        },
      } = action;

      const tx = Transaction({
        context,
        createdAt,
        from,
        group,
        id,
        identifier,
        methodContext,
        methodName,
        multisig,
        options,
        params,
        status,
      } as TransactionRecordProps);

      return state.setIn(
        [CORE_TRANSACTIONS_LIST, id],
        tx.set('group', transactionGroup(tx)),
      );
    }
    case ActionTypes.MULTISIG_TRANSACTION_REFRESHED: {
      const {
        meta: { id },
        payload,
      } = action;
      return state.mergeIn([CORE_TRANSACTIONS_LIST, id], payload);
    }
    case ActionTypes.TRANSACTION_ADD_IDENTIFIER: {
      const {
        meta: { id },
        payload: { identifier },
      } = action;
      return state.setIn(
        [CORE_TRANSACTIONS_LIST, id, 'identifier'],
        identifier,
      );
    }
    case ActionTypes.TRANSACTION_ADD_PARAMS: {
      const {
        meta: { id },
        payload: { params },
      } = action;
      return state.mergeIn([CORE_TRANSACTIONS_LIST, id, 'params'], params);
    }
    case ActionTypes.TRANSACTION_READY: {
      const {
        meta: { id },
      } = action;
      return state.setIn(
        [CORE_TRANSACTIONS_LIST, id, 'status'],
        TRANSACTION_STATUSES.READY,
      );
    }
    case ActionTypes.TRANSACTION_LOAD_RELATED: {
      const {
        meta: { id },
        payload: { loading },
      } = action;
      return state.setIn(
        [CORE_TRANSACTIONS_LIST, id, 'loadingRelated'],
        loading,
      );
    }
    case ActionTypes.TRANSACTION_GAS_UPDATE: {
      const {
        meta: { id },
        payload,
      } = action;
      return state.mergeIn([CORE_TRANSACTIONS_LIST, id], payload);
      // Do we want an 'estimated' state for TX?
    }
    case ActionTypes.TRANSACTION_SEND: {
      const {
        meta: { id },
      } = action;
      // Clear errors and set to ready, because this action also retries sending
      return state
        .setIn([CORE_TRANSACTIONS_LIST, id, 'error'], undefined)
        .setIn(
          [CORE_TRANSACTIONS_LIST, id, 'status'],
          TRANSACTION_STATUSES.READY,
        );
    }
    case ActionTypes.TRANSACTION_HASH_RECEIVED: {
      const {
        meta: { id },
        payload: { hash },
      } = action;
      return state.setIn([CORE_TRANSACTIONS_LIST, id, 'hash'], hash);
    }
    case ActionTypes.TRANSACTION_SENT: {
      const {
        meta: { id },
      } = action;
      return state.setIn(
        [CORE_TRANSACTIONS_LIST, id, 'status'],
        TRANSACTION_STATUSES.PENDING,
      );
    }
    case ActionTypes.TRANSACTION_RECEIPT_RECEIVED: {
      const {
        meta: { id },
        payload: { receipt },
      } = action;
      return state.mergeIn([CORE_TRANSACTIONS_LIST, id], {
        receipt,
      });
    }
    case ActionTypes.TRANSACTION_SUCCEEDED: {
      const {
        meta: { id },
        payload: { eventData },
      } = action;
      return state.mergeIn([CORE_TRANSACTIONS_LIST, id], {
        eventData,
        status: TRANSACTION_STATUSES.SUCCEEDED,
      });
    }
    case ActionTypes.TRANSACTION_ERROR: {
      const {
        meta: { id },
        payload: { error },
      } = action;
      return state.mergeIn([CORE_TRANSACTIONS_LIST, id], {
        error,
        status: TRANSACTION_STATUSES.FAILED,
      });
    }
    case ActionTypes.TRANSACTION_CANCEL: {
      const {
        meta: { id },
      } = action;
      const tx = state.list.get(id);
      if (!tx) return state;
      if (tx.group) {
        return state.update(CORE_TRANSACTIONS_LIST, list =>
          list.filter(filterTx => {
            // Keep all transactions with no group
            if (!filterTx.group || !tx.group) return true;
            // Keep all transactions with a different groupId
            if (filterTx.group.id !== tx.group.id) return true;
            // Keep all transactions with the same groupId but a lower index
            return filterTx.group.index < tx.group.index;
          }),
        );
      }
      return state.deleteIn([CORE_TRANSACTIONS_LIST, id]);
    }
    default:
      return state;
  }
};

export default coreTransactionsReducer;
