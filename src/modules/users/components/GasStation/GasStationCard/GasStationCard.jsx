/* @flow */

import React, { Fragment, Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TransactionRecord } from '~immutable';

import Heading from '~core/Heading';
import Card from '~core/Card';
import { Tooltip } from '~core/Popover';
import UserMention from '~core/UserMention';
import ExternalLink from '~core/ExternalLink';
import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';

import styles from './GasStationCard.css';

const MSG = defineMessages({
  transactionState: {
    id: 'users.GasStationPopover.GasStationCard.transactionState',
    defaultMessage: `{status, select,
      multisig {Waiting on {username} to sign}
      failed {Failed transaction. Try again}
      succeeded {Transaction succeeded}
      other {Generic transaction}
    }`,
  },
  actionState: {
    id: 'users.GasStationPopover.GasStationCard.actionState',
    defaultMessage: `{status, select,
      multisig {Waiting on {username} to sign}
      pending {Pending transaction}
      succeeded {Your transaction was successful}
      other {Generic transaction}
    }`,
  },
  dependentAction: {
    id: 'users.GasStationPopover.GasStationCard.dependentAction',
    defaultMessage: 'Dependent transaction',
  },
  failedAction: {
    id: 'users.GasStationPopover.GasStationCard.failedAction',
    defaultMessage: 'Failed transaction. Try again.',
  },
  transactionTitle: {
    id: 'users.GasStationPopover.GasStationCard.transactionTitle',
    defaultMessage: `{methodName, select,
      registerUserLabel {Claim your profile}
      other {Generic Transaction}
    }`,
  },
  /*
   * @NOTE Below this line are just temporary message descriptors as the actual
   * name / path combinations for the various actions-transactions
   * should be implemented in #542
   */
  actionDescriptionSample: {
    id: 'users.GasStationPopover.GasStationCard.actionDescriptionSample',
    defaultMessage: `{index}. Create Task`,
  },
});

type Props = {
  idx: number,
  transaction: TransactionRecord<*, *>,
  /*
   * @NOTE When the card is in the expanded mode, it's intent is to be rendered
   * as a single element, and not part of a list.
   * It is up to you do handle that rendering logic.
   */
  expanded?: boolean,
  onClick?: (idx: number) => void,
};

type State = {
  actionToCancel: number | void,
};

class GasStationCard extends Component<Props, State> {
  static displayName = 'users.GasStationPopover.GasStationCard';

  /*
   * @NOTE This needs to be static since we don't use any props from the
   * Component's own instance (Eg: `this`)
   *
   * This also changes the way we need to call it, as again, it's not available
   * on the actual instance.
   */
  static renderActionDescription(
    hasDependency: boolean,
    status?: string,
    actionIndex: number,
  ) {
    return (
      <div className={styles.description}>
        <Tooltip
          placement="top"
          showArrow
          content={
            <span className={styles.tooltipContentReset}>
              <FormattedMessage {...MSG.dependentAction} />
            </span>
          }
          trigger={hasDependency ? 'hover' : 'disabled'}
        >
          {/*
           * @NOTE The tooltip content needs to be wrapped inside a block
           * element otherwise it won't detect the hover event
           */}
          <div>
            <FormattedMessage
              {...MSG.actionDescriptionSample}
              values={{ index: actionIndex + 1 }}
            />
            {status && status === 'failed' && (
              <span className={styles.failedActionDescription}>
                <FormattedMessage {...MSG.failedAction} />
              </span>
            )}
          </div>
        </Tooltip>
      </div>
    );
  }

  state = {
    actionToCancel: undefined,
  };

  handleClearCancel() {
    return this.setState({ actionToCancel: undefined });
  }

  handleClick = () => {
    const { idx, onClick } = this.props;
    if (onClick) onClick(idx);
  };

  handleCancel() {
    /*
     * @TODO Actually cancel the action, not just log to the console...
     */
    /* eslint-disable-next-line no-console */
    console.log('Cancelled the action');
    return this.handleClearCancel();
  }

  handleCancelClick(actionIndexToCancel: number) {
    return this.setState({ actionToCancel: actionIndexToCancel });
  }

  getActionItemClasses(
    transaction: TransactionRecord<*, *>,
    actionIndex: number,
  ) {
    const { actionToCancel } = this.state;
    /*
     * Default class
     */
    let className: string = styles.actionItem;
    /*
     * If the action is failed, switch the default class
     */
    if (transaction.status === 'failed') {
      className = styles.failedActionItem;
    }
    /*
     * If we're cancelling the action, attach this class, since it's only temporary
     */
    if (actionToCancel === actionIndex) {
      className += ` ${styles.cancelActionItem}`;
    }

    return className;
  }

  renderSummary() {
    const {
      transaction: { status, dependents = [], methodName, context },
    } = this.props;
    return (
      <div className={styles.summary}>
        <div className={styles.description}>
          <Heading
            appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
          >
            {context && methodName && (
              <FormattedMessage
                id={`transaction.${context}.${methodName}.title`}
                values={{ context, methodName }}
              />
            )}
          </Heading>
          {context && methodName && (
            <FormattedMessage
              id={
                process.env.DEBUG
                  ? `transaction.debug.description`
                  : `transaction.${context}.${methodName}.description`
              }
              values={{ context, methodName }}
            />
          )}
        </div>
        {status && (
          <div className={styles.status}>
            <Tooltip
              placement="top"
              showArrow
              content={
                <FormattedMessage
                  {...MSG.transactionState}
                  values={{
                    status,
                    username: (
                      /*
                       * @TODO Add actual username from the multisig address
                       */
                      <UserMention username="user" hasLink={false} />
                    ),
                  }}
                />
              }
            >
              {/*
               * @NOTE The tooltip content needs to be wrapped inside a block
               * element otherwise it won't detect the hover event
               */}
              <div>
                {status === 'created' ||
                  (status === 'ready' && (
                    <span className={styles.counter}>1</span>
                  ))}
                {status === 'succeeded' && (
                  <span className={styles.completedAction}>
                    <Icon
                      appearance={{ size: 'tiny' }}
                      name="check-mark"
                      /*
                       * @NOTE We disable the title since we already
                       * have a tooltip around it
                       */
                      title=""
                    />
                  </span>
                )}
                {status === 'pending' && (
                  <div className={styles.spinner}>
                    <SpinnerLoader
                      appearance={{
                        size: 'small',
                        theme: 'primary',
                      }}
                    />
                  </div>
                )}
                {status === 'multisig' && <span className={styles.multisig} />}
                {status === 'failed' && (
                  <span className={styles.failed}>!</span>
                )}
              </div>
            </Tooltip>
          </div>
        )}
        {!status && dependents && dependents.length ? (
          <div className={styles.status}>
            <span className={styles.counter}>{dependents.length}</span>
          </div>
        ) : null}
      </div>
    );
  }

  renderCancelInteraction(actionIndex: number) {
    const { actionToCancel } = this.state;
    /*
     * @NOTE Can't use a `button` here since we're already a descendent of
     * a button, and React will go nuts.
     * Also, as jsx-a11y points out, it's better to use a `span`/`div`
     * instead of an `a`, since that implies an anchor
     */
    return (
      <Fragment>
        {actionToCancel === actionIndex ? (
          <Fragment>
            <span
              role="button"
              tabIndex={0}
              className={styles.cancelAction}
              onClick={() => this.handleCancel()}
              onKeyDown={this.handleCancel}
            >
              <FormattedMessage {...{ id: 'button.yes' }} />
            </span>
            <span className={styles.cancelActionsDecision}>/</span>
            <span
              role="button"
              tabIndex={0}
              className={styles.cancelAction}
              onClick={() => this.handleClearCancel()}
              onKeyDown={this.handleClearCancel}
            >
              <FormattedMessage {...{ id: 'button.no' }} />
            </span>
          </Fragment>
        ) : (
          <span
            role="button"
            tabIndex={0}
            className={styles.cancelAction}
            onClick={() => this.handleCancelClick(actionIndex)}
            onKeyDown={() => this.handleCancelClick(actionIndex)}
          >
            <FormattedMessage {...{ id: 'button.cancel' }} />
          </span>
        )}
      </Fragment>
    );
  }

  renderActionStatus(
    transaction: TransactionRecord<*, *>,
    actionIndex: number,
  ) {
    if (!transaction.dependency) {
      return (
        <div className={styles.status}>
          {transaction.status && (
            <Fragment>
              {!transaction.multisig && (
                <ExternalLink
                  href={`https://rinkeby.etherscan.io/tx/${
                    /*
                     * @NOTE This is just here because otherwise prettier
                     * goes crazy and suggest a wrong fix
                     */
                    transaction.hash || 0
                  }`}
                  /*
                   * @NOTE As it was pointed out, this is a name, not a value
                   * that needs to be internationalized and translated
                   */
                  text="Etherscan"
                  className={styles.actionInteraction}
                />
              )}
              <Tooltip
                placement="top"
                showArrow
                content={
                  <span className={styles.tooltipContentReset}>
                    <FormattedMessage
                      {...MSG.actionState}
                      values={{
                        status: transaction.status,
                        username: (
                          /*
                           * @TODO Add actual username from the multisig address
                           */
                          <UserMention username="user" hasLink={false} />
                        ),
                      }}
                    />
                  </span>
                }
              >
                {/*
                 * @NOTE The tooltip content needs to be wrapped inside a block
                 * element otherwise it won't detect the hover event
                 */}
                <div className={styles.actionStatusTooltipWrapper}>
                  {transaction.status === 'succeeded' && (
                    <span className={styles.completedAction}>
                      <Icon
                        appearance={{ size: 'tiny' }}
                        name="check-mark"
                        /*
                         * @NOTE We disable the title since we already
                         * have a tooltip around it
                         */
                        title=""
                      />
                    </span>
                  )}
                  {transaction.status === 'pending' && (
                    <div className={styles.spinner}>
                      <SpinnerLoader
                        appearance={{
                          size: 'small',
                          theme: 'primary',
                        }}
                      />
                    </div>
                  )}
                  {transaction.multisig && (
                    <span className={styles.multisigAction} />
                  )}
                </div>
              </Tooltip>
            </Fragment>
          )}
          {!transaction.status && this.renderCancelInteraction(actionIndex)}
        </div>
      );
    }
    return null;
  }

  renderActionItem(transaction: TransactionRecord<*, *>, actionIndex: number) {
    const { renderActionDescription } = GasStationCard;
    return (
      <li
        /*
         * @NOTE Nonces are unique, but our mock data might add duplicates.
         * In case you see duplicate key errors in the console, don't panic.
         */
        key={transaction.id}
        disabled={transaction.dependency}
        className={this.getActionItemClasses(transaction, actionIndex)}
      >
        {renderActionDescription(
          !!transaction.dependency,
          transaction.status,
          actionIndex,
        )}
        {this.renderActionStatus(transaction, actionIndex)}
      </li>
    );
  }

  render() {
    const {
      transaction: { dependents = [] },
      expanded = false,
      onClick,
    } = this.props;
    const canWeExpand = expanded && dependents && dependents.length;
    return (
      <Card className={canWeExpand ? styles.cardExpanded : styles.card}>
        <button
          type="button"
          className={styles.button}
          onClick={this.handleClick}
          disabled={expanded || !onClick}
        >
          {this.renderSummary()}
          {canWeExpand ? (
            <ul className={styles.expanded}>
              {dependents.map((action, index) =>
                this.renderActionItem(action, index),
              )}
            </ul>
          ) : null}
        </button>
      </Card>
    );
  }
}

export default GasStationCard;
