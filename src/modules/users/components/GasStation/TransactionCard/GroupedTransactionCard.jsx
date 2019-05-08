/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TransactionType } from '~immutable';
import type { Action } from '~redux';

import { ACTIONS } from '~redux';
import { getMainClasses } from '~utils/css';

import { Tooltip } from '~core/Popover';

import styles from './GroupedTransactionCard.css';

import TransactionStatus from './TransactionStatus.jsx';

const MSG = defineMessages({
  hasDepedentTx: {
    id: 'users.GasStation.GroupedTransactionCard.hasDepedentTx',
    defaultMessage: 'Dependent transaction',
  },
  failedTx: {
    id: 'users.GasStation.GroupedTransactionCard.failedTx',
    defaultMessage: 'Failed transaction. Try again.',
  },
});

type Props = {|
  cancelTransaction: (id: string) => Action<typeof ACTIONS.TRANSACTION_CANCEL>,
  idx: number,
  selected: boolean,
  transaction: TransactionType<*, *>,
|};

type State = {|
  isShowingCancelConfirmation: boolean,
|};

class GroupedTransactionCard extends Component<Props, State> {
  static displayName = 'users.GasStation.GroupedTransactionCard';

  state = {
    isShowingCancelConfirmation: false,
  };

  cancelTransaction = () => {
    const {
      transaction: { id },
      cancelTransaction,
    } = this.props;
    cancelTransaction(id);
  };

  toggleCancelConfirmation = () =>
    this.setState(({ isShowingCancelConfirmation }) => ({
      isShowingCancelConfirmation: !isShowingCancelConfirmation,
    }));

  renderCancel() {
    const { isShowingCancelConfirmation } = this.state;
    return (
      <Fragment>
        {isShowingCancelConfirmation ? (
          <Fragment>
            <button
              type="button"
              className={styles.confirmationButton}
              onClick={this.cancelTransaction}
            >
              <FormattedMessage {...{ id: 'button.yes' }} />
            </button>
            <span className={styles.cancelDecision}>/</span>
            <button
              type="button"
              className={styles.confirmationButton}
              onClick={this.toggleCancelConfirmation}
            >
              <FormattedMessage {...{ id: 'button.no' }} />
            </button>
          </Fragment>
        ) : (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={this.toggleCancelConfirmation}
          >
            <FormattedMessage {...{ id: 'button.cancel' }} />
          </button>
        )}
      </Fragment>
    );
  }

  render() {
    const {
      idx,
      selected,
      transaction: { context, methodName, status, params, titleMessageId },
    } = this.props;
    const { isShowingCancelConfirmation } = this.state;
    const ready = status === 'ready';
    const failed = status === 'failed';
    const succeeded = status === 'succeeded';
    // Only transactions that can be signed can also be cancelled
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
                <FormattedMessage {...MSG.hasDepedentTx} />
              </span>
            }
            trigger={hasDependency ? 'hover' : 'disabled'}
          >
            <div>
              {`${idx + 1}. `}
              <FormattedMessage
                id={
                  titleMessageId ||
                  `transaction.${
                    context ? `${context}.` : ''
                  }${methodName}.title`
                }
                values={params}
              />
              {failed && (
                <span className={styles.failedDescription}>
                  <FormattedMessage {...MSG.failedTx} />
                </span>
              )}
            </div>
          </Tooltip>
        </div>
        {canBeSigned ? (
          this.renderCancel()
        ) : (
          // multisig: pass proper multisig prop here
          <TransactionStatus status={status} multisig={{}} />
        )}
      </li>
    );
  }
}

export default GroupedTransactionCard;
