import React, { useState, useCallback, useEffect, useContext } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import { TransactionType, TRANSACTION_STATUSES } from '~immutable/index';
import { Tooltip } from '~core/Popover';
import { useDialog } from '~core/Dialog';
import { transactionCancel } from '../../../../core/actionCreators';

import WrongNetworkDialog from '~dialogs/WrongNetworkDialog';

import { getMainClasses } from '~utils/css';

import { Appearance } from '../GasStationContent';
import styles from './GroupedTransactionCard.css';
import TransactionStatus from './TransactionStatus';
import { GasStationContext } from '../GasStationProvider';

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
    group,
    metatransaction,
    title,
    titleValues,
  },
}: Props) => {
  const dispatch = useDispatch();
  const { updateTransactionAlert, transactionAlerts } = useContext(
    GasStationContext,
  );
  /*
   * @TODO Replace with proper modal
   */
  const openWrongNetworkDialog = useDialog(WrongNetworkDialog);

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

  useEffect(() => {
    if (
      /*
       * @NOTE Sadly we don't have a better way currently to detect this error
       */
      error?.message.includes('Contract does not support MetaTransactions') &&
      !transactionAlerts?.[id]?.wasSeen &&
      !transactionAlerts?.[id]?.isOpen
    ) {
      /*
       * @TODO Replace with proper modal
       * @TODO Add logic to display the modal
       * (the `seen` tracking needs to be included in that logic)
       */
      /*
       * @NOTE due to the way the dialog provider works you need to pass
       * all values being updated to the update function
       * (even though it's supposed to handle individual updates as well)
       */
      updateTransactionAlert(id, { wasSeen: true, isOpen: true });
      openWrongNetworkDialog()
        .afterClosed()
        /*
         * @NOTE due to the way the dialog provider works you need to pass
         * all values being updated to the update function
         * (even though it's supposed to handle individual updates as well)
         */
        .catch(() =>
          updateTransactionAlert(id, { wasSeen: true, isOpen: false }),
        );
    }
  }, [
    error,
    id,
    openWrongNetworkDialog,
    transactionAlerts,
    updateTransactionAlert,
  ]);

  const ready = status === TRANSACTION_STATUSES.READY;
  const failed = status === TRANSACTION_STATUSES.FAILED;
  const succeeded = status === TRANSACTION_STATUSES.SUCCEEDED;

  // Only transactions that can be signed can be cancelled
  const canBeSigned = selected && ready;

  // A prior transaction was selected
  const hasDependency = ready && !selected;

  const defaultTransactionMessageDescriptorId = {
    id: `${metatransaction ? 'meta' : ''}transaction.${
      context ? `${context}.` : ''
    }${methodName}.${methodContext ? `${methodContext}.` : ''}title`,
  };

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
          content={
            <span>
              <FormattedMessage {...MSG.hasDependentTx} />
            </span>
          }
          trigger={hasDependency ? 'hover' : null}
        >
          <div>
            {`${(group?.index || idx) + 1}. `}
            <FormattedMessage
              {...defaultTransactionMessageDescriptorId}
              {...title}
              values={titleValues || params}
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
        <TransactionStatus status={status} loadingRelated={loadingRelated} />
      )}
    </li>
  );
};

GroupedTransactionCard.displayName = 'users.GasStation.GroupedTransactionCard';

export default GroupedTransactionCard;
