/* @flow */

// $FlowFixMe
import React, { useState, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import type { TransactionType } from '~immutable';
import type { Appearance } from '../GasStationContent';

import { getMainClasses } from '~utils/css';

import { transactionCancel } from '../../../../core/actionCreators';

import { Tooltip } from '~core/Popover';

import styles from './GroupedTransactionCard.css';

import TransactionStatus from './TransactionStatus.jsx';

const MSG = defineMessages({
  hasDependentTx: {
    id: 'users.GasStation.GroupedTransactionCard.hasDependentTx',
    defaultMessage: 'Dependent transaction',
  },
  failedTx: {
    id: 'users.GasStation.GroupedTransactionCard.failedTx',
    defaultMessage: '{type}: {message}',
  },
});

type Props = {|
  appearance: Appearance,
  idx: number,
  selected: boolean,
  transaction: TransactionType,
|};

const GroupedTransactionCard = ({
  appearance: { required },
  idx,
  selected,
  transaction: {
    context,
    error,
    id,
    methodContext,
    methodName,
    params,
    status,
  },
}: Props) => {
  const dispatch = useDispatch();

  const handleCancel = useCallback(
    () => {
      dispatch(transactionCancel(id));
    },
    [dispatch, id],
  );

  const [
    isShowingCancelConfirmation,
    setIsShowingCancelConfirmation,
  ] = useState(false);

  const toggleCancelConfirmation = useCallback(
    () => {
      setIsShowingCancelConfirmation(!isShowingCancelConfirmation);
    },
    [isShowingCancelConfirmation],
  );

  const ready = status === 'ready';
  const failed = status === 'failed';
  const succeeded = status === 'succeeded';

  // Only transactions that can be signed can be cancelled
  const canBeSigned = selected && ready;

  // A prior transaction was selected
  const hasDependency = ready && !selected;

  return (
    <li
      className={getMainClasses({}, styles, {
        failed,
        isShowingCancelConfirmation,
        selected,
        succeeded,
      })}
    >
      <div className={styles.description}>
        <Tooltip
          placement="top"
          showArrow
          content={
            <span className={styles.tooltip}>
              <FormattedMessage {...MSG.hasDependentTx} />
            </span>
          }
          trigger={hasDependency ? 'hover' : 'disabled'}
        >
          <div>
            {`${idx + 1}. `}
            <FormattedMessage
              id={`transaction.${context ? `${context}.` : ''}${methodName}.${
                methodContext ? `${methodContext}.` : ''
              }title`}
              values={params}
            />
            {failed && (
              <span className={styles.failedDescription}>
                <FormattedMessage
                  {...MSG.failedTx}
                  values={{
                    type: (
                      <FormattedMessage
                        id={`transaction.error.${error.type}`}
                      />
                    ),
                    message: error.message,
                  }}
                />
              </span>
            )}
          </div>
        </Tooltip>
      </div>
      {canBeSigned && !required ? (
        <>
          {isShowingCancelConfirmation ? (
            <>
              <button
                type="button"
                className={styles.confirmationButton}
                onClick={handleCancel}
              >
                <FormattedMessage {...{ id: 'button.yes' }} />
              </button>
              <span className={styles.cancelDecision}>/</span>
              <button
                type="button"
                className={styles.confirmationButton}
                onClick={toggleCancelConfirmation}
              >
                <FormattedMessage {...{ id: 'button.no' }} />
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={toggleCancelConfirmation}
            >
              <FormattedMessage {...{ id: 'button.cancel' }} />
            </button>
          )}
        </>
      ) : (
        // multisig: pass proper multisig prop here
        <TransactionStatus status={status} multisig={{}} />
      )}
    </li>
  );
};

GroupedTransactionCard.displayName = 'users.GasStation.GroupedTransactionCard';

export default GroupedTransactionCard;
