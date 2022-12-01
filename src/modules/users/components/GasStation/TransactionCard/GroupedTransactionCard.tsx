import React, { useState, useCallback, useEffect, useContext } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDispatch } from 'redux-react-hook';

import { TransactionType, TRANSACTION_STATUSES } from '~immutable/index';
import { Tooltip } from '~core/Popover';
import { useDialog } from '~core/Dialog';
import ExternalLink from '~core/ExternalLink';
import { transactionCancel } from '../../../../core/actionCreators';

import TransactionAlertDialog from '~dialogs/TransactionAlertDialog';

import { getMainClasses } from '~utils/css';
import {
  isGasStationMetatransactionError,
  isMetatransactionErrorFromColonyContract,
} from '~utils/web3';
import { METATRANSACTIONS_LEARN_MORE } from '~externalUrls';

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
  metaTransactionsAlert: {
    id: 'users.GasStation.GroupedTransactionCard.metaTransactionsAlert',
    /* eslint-disable max-len */
    defaultMessage: `
Colony now covers your gas fees when performing actions on Colony. In order for it to work, your Colony needs to be upgraded to at least v9, the One Transaction Payment extension to at least v3 and Governance (Reputation Weighted) extension to at least v4.

You can toggle this feature, called Metatransactions, in your User Settings under the Advanced Settings tab.

{learnMoreLink}`,
    /* eslint-enable max-len */
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
    methodName: defaultMethodName,
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
  const openTransactionAlertDialog = useDialog(TransactionAlertDialog);

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
      isGasStationMetatransactionError(error) &&
      isMetatransactionErrorFromColonyContract(error) &&
      !transactionAlerts?.[id]?.wasSeen &&
      !transactionAlerts?.[id]?.isOpen
    ) {
      /*
       * @NOTE due to the way the dialog provider works you need to pass
       * all values being updated to the update function
       * (even though it's supposed to handle individual updates as well)
       */
      updateTransactionAlert(id, { wasSeen: true, isOpen: true });
      openTransactionAlertDialog({
        text: MSG.metaTransactionsAlert,
        textValues: {
          learnMoreLink: (
            <ExternalLink
              href={METATRANSACTIONS_LEARN_MORE}
              text={{ id: 'text.learnMore' }}
            />
          ),
        },
      })
        .afterClosed()
        /*
         * @NOTE due to the way the dialog provider works you need to pass
         * all values being updated to the update function
         * (even though it's supposed to handle individual updates as well)
         *
         * @NOTE2 We need catch in here since clicking outside, or the close
         * icon counts as `cancel` rather than `close`, and as to not show
         * an error when we really shouldn't
         */
        .catch(() => null)
        /*
         * @NOTE We need to perform the action in the `finally` block in order
         * to account for both the `cancel` and the `close` actions
         */
        .finally(() =>
          updateTransactionAlert(id, { wasSeen: true, isOpen: false }),
        );
    }
  }, [
    error,
    id,
    openTransactionAlertDialog,
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

  /*
    @NOTE: We do this so that we can display a more specific transaction copy in the case of adding/removing safes,
    otherwise the transaction would display the copy we have for editColony actions, which is technically correct
    but not clear enough.
  */
  const methodName =
    group?.key === 'removeExistingSafes' || group?.key === 'addExistingSafe'
      ? group.key
      : defaultMethodName;
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
