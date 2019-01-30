/* @flow */

import { fromJS } from 'immutable';
import getObjectFromPath from 'lodash/get';

import type { UniqueAction } from '~types';
import type { CoreTransactionsRecord, TransactionRecordType } from '~immutable';

import { TransactionRecord, CoreTransactions } from '~immutable';

import { CORE_GAS_PRICES, CORE_TRANSACTIONS_LIST } from '../constants';
import {
  MULTISIG_TRANSACTION_CREATED,
  MULTISIG_TRANSACTION_REFRESHED,
  TRANSACTION_CREATED,
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_GAS_UPDATE,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_ADD_PROPERTIES,
  TRANSACTION_SENT,
  TRANSACTION_CANCEL,
  GAS_PRICES_UPDATE,
} from '../actionTypes';

/*
 * Helpers for transaction transformations
 */
const transactionGroup = (tx: TransactionRecordType<*, *>) => {
  if (!tx.group || typeof tx.group.id == 'string') return tx.group;
  const id = tx.group.id.reduce(
    (resultId, entry) => `${resultId}-${getObjectFromPath(tx, entry)}`,
    tx.group.key,
  );
  return {
    ...tx.group,
    id,
  };
};

const coreTransactionsReducer = (
  state: CoreTransactionsRecord = CoreTransactions(),
  { type, payload, meta }: UniqueAction,
) => {
  switch (type) {
    case TRANSACTION_CREATED:
    case MULTISIG_TRANSACTION_CREATED: {
      const { id } = meta;
      const {
        context,
        createdAt,
        identifier,
        lifecycle,
        methodName,
        multisig,
        options,
        params,
        status,
      } = payload;

      const tx = TransactionRecord({
        context,
        createdAt,
        id,
        identifier,
        lifecycle,
        methodName,
        multisig,
        options,
        params,
        status,
      });

      return state.setIn(
        [CORE_TRANSACTIONS_LIST, id],
        tx.set('group', transactionGroup(tx)),
      );
    }
    case TRANSACTION_ADD_PROPERTIES: {
      const { id } = meta;
      return state.mergeIn(
        [CORE_TRANSACTIONS_LIST, id],
        fromJS({ ...payload, status: 'ready' }),
      );
    }
    case MULTISIG_TRANSACTION_REFRESHED: {
      const { id } = meta;
      return state.mergeIn([CORE_TRANSACTIONS_LIST, id], fromJS(payload));
    }
    case TRANSACTION_GAS_UPDATE: {
      const { id } = meta;
      return state.mergeIn([CORE_TRANSACTIONS_LIST, id], fromJS(payload));
      // TODO: do we want an 'estimated' state for TX?
    }
    case TRANSACTION_SENT: {
      const { id } = meta;
      const { hash } = payload;
      return state.mergeIn(
        [CORE_TRANSACTIONS_LIST, id],
        fromJS({
          hash,
          status: 'pending',
        }),
      );
    }
    case TRANSACTION_RECEIPT_RECEIVED: {
      const { id } = meta;
      const { receipt } = payload;
      return state.mergeIn(
        [CORE_TRANSACTIONS_LIST, id],
        fromJS({
          receipt,
        }),
      );
    }
    case TRANSACTION_EVENT_DATA_RECEIVED: {
      const { id } = meta;
      const { eventData } = payload;
      return state.mergeIn(
        [CORE_TRANSACTIONS_LIST, id],
        fromJS({
          eventData,
          status: 'succeeded',
        }),
      );
    }
    case TRANSACTION_ERROR: {
      const { id } = meta;
      const { error } = payload;
      return state
        .updateIn([CORE_TRANSACTIONS_LIST, id, 'errors'], errors =>
          errors.push(error),
        )
        .setIn([CORE_TRANSACTIONS_LIST, id, 'status'], 'failed');
    }
    case TRANSACTION_CANCEL: {
      const { id } = meta;
      const tx = state.list.get(id);
      if (!tx) return state;
      if (tx.group) {
        return state.update(CORE_TRANSACTIONS_LIST, list =>
          list.filter(filterTx => {
            // Keep all transactions with no group
            if (!filterTx.group) return true;
            // Keep all transactions with a different groupId
            if (!filterTx.group.id !== tx.group.id) return true;
            // Keep all transactions with the same groupId but a lower index
            if (filterTx.group.index < tx.group.index) return true;
            return false;
          }),
        );
      }
      return state.deleteIn([CORE_TRANSACTIONS_LIST, id]);
    }
    case GAS_PRICES_UPDATE:
      return state.mergeIn([CORE_GAS_PRICES], fromJS(payload));
    default:
      return state;
  }
};

export default coreTransactionsReducer;
