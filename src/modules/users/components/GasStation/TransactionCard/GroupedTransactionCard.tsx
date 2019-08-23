import React, { useState, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import { TransactionType, TRANSACTION_STATUSES } from '~immutable/index';
import { Appearance } from '../GasStationContent';
import { getMainClasses } from '~utils/css';
import { transactionCancel } from '../../../../core/actionCreators';
import { Tooltip } from '~core/Popover';
import styles from './GroupedTransactionCard.css';
import TransactionStatus from './TransactionStatus';

const MSG = defineMessages({
  hasDependentTx: {
    id: 'users.GasStation.GroupedTransactionCard.hasDependentTx',
    defaultMessage: 'Dependent transaction',
  },
  failedTx: {
    id: 'users.GasStation.GroupedTransactionCard.failedTx',
    defaultMessage: `{type, select,
      ESTIMATE {Estimation error}
      EVENT_DATA {Event data error}
      MULTISIG_NONCE {Multisig nonce}
      MULTISIG_REFRESH {Multisig refresh}
      MULTISIG_REJECT {Multisig rejected}
      MULTISIG_SIGN {Multisig signature}
      RECEIPT {Receipt error}
      SEND {Send error}
      UNSUCCESSFUL {Unsuccessful}
      }: {message}`,
  },
});

interface Props {
  appearance: Appearance;
  idx: number;
  selected: boolean;
  transaction: TransactionType;
}

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
    loadingRelated,
  },
}: Props) => {
  const dispatch = useDispatch();

  const handleCancel = useCallback(() => {
    dispatch(transactionCancel(id));
  }, [dispatch, id]);

  const [
    isShowingCancelConfirmation,
    setIsShowingCancelConfirmation,
  ] = useState(false);

  const toggleCancelConfirmation = useCallback(() => {
    setIsShowingCancelConfirmation(!isShowingCancelConfirmation);
  }, [isShowingCancelConfirmation]);

  const ready = status === TRANSACTION_STATUSES.READY;
  const failed = status === TRANSACTION_STATUSES.FAILED;
  const succeeded = status === TRANSACTION_STATUSES.SUCCEEDED;

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
            {failed && error && (
              <span className={styles.failedDescription}>
                <FormattedMessage {...MSG.failedTx} values={{ ...error }} />
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
        <TransactionStatus
          status={status}
          loadingRelated={loadingRelated}
          // multisig={{}}
        />
      )}
    </li>
  );
};

GroupedTransactionCard.displayName = 'users.GasStation.GroupedTransactionCard';

export default GroupedTransactionCard;
