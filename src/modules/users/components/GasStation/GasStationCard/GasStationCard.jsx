/* @flow */

import React, { Fragment, Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TransactionType } from '~types';

import Heading from '~core/Heading';
import Card from '~core/Card';
import Link from '~core/Link';
import { Tooltip } from '~core/Popover';
import UserMention from '~core/UserMention';
import ExternalLink from '~core/ExternalLink';
import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';

/*
 * @NOTE This is just temporary and should be replaced with a dynamic route
 * coming from the transaction object
 */
import { DASHBOARD_ROUTE } from '~routes';

import styles from './GasStationCard.css';

const MSG = defineMessages({
  transactionState: {
    id: 'dashboard.GasStation.GasStationCard.transactionState',
    defaultMessage: `{status, select,
      multisig {Waiting on {username} to sign}
      failed {Failed transaction. Try again}
      other {Generic transaction}
    }`,
  },
  actionState: {
    id: 'dashboard.GasStation.GasStationCard.actionState',
    defaultMessage: `{status, select,
      multisig {Waiting on {username} to sign}
      pending {Pending transaction}
      succeeded {Your transaction was successful}
      other {Generic transaction}
    }`,
  },
  dependentAction: {
    id: 'dashboard.GasStation.GasStationCard.dependentAction',
    defaultMessage: 'Dependent transaction',
  },
  failedAction: {
    id: 'dashboard.GasStation.GasStationCard.failedAction',
    defaultMessage: 'Failed transaction. Try again.',
  },
  /*
   * @NOTE Below this line are just temporary message descriptors as the actual
   * name / path combinations for the various actions-transactions
   * should be implemented in #542
   */
  transactionTitleSample: {
    id: 'dashboard.GasStation.GasStationCard.transactionTitleSample',
    defaultMessage: 'Create Task',
  },
  transactionDescriptionSample: {
    id: 'dashboard.GasStation.GasStationCard.transactionDescriptionSample',
    defaultMessage: 'The Meta Colony / #Javascript / Github Integration',
  },
  actionDescriptionSample: {
    id: 'dashboard.GasStation.GasStationCard.actionDescriptionSample',
    defaultMessage: `{index}. Create Task`,
  },
});

type Props = {
  transaction: TransactionType,
  /*
   * @NOTE When the card is in the expanded mode, it's intent is to be rendered
   * as a single element, and not part of a list.
   * It is up to you do handle that rendering logic.
   */
  expanded?: boolean,
  onClick?: (event: SyntheticEvent<>) => void,
};

type State = {
  actionToCancel: number | void,
};

class GasStationCard extends Component<Props, State> {
  static displayName = 'dashboard.GasStation.GasStationCard';

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

  getActionItemClasses(action: TransactionType, actionIndex: number) {
    const { actionToCancel } = this.state;
    /*
     * Default class
     */
    let className: string = styles.actionItem;
    /*
     * If the action is failed, switch the default class
     */
    if (action.status && action.status === 'failed') {
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
      transaction: { status, dependents = [] },
    } = this.props;
    return (
      <div className={styles.summary}>
        <div className={styles.description}>
          <Heading
            appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
            text={MSG.transactionTitleSample}
          />
          <Link
            className={styles.transactionLink}
            text={MSG.transactionDescriptionSample}
            to={DASHBOARD_ROUTE}
            /*
             * @NOTE If this is an expanded card, and has an onclick handler,
             * don't bubble the click up as this link will most likely redirect to
             * another place, so there's no reason to change the state prior to that
             */
            onClick={(event: SyntheticEvent<>) => event.stopPropagation()}
          />
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

  renderActionStatus(action: TransactionType, actionIndex: number) {
    if (!action.dependency) {
      return (
        <div className={styles.status}>
          {action.status && (
            <Fragment>
              {action.status !== 'multisig' && (
                <ExternalLink
                  href={`https://rinkeby.etherscan.io/tx/${
                    /*
                     * @NOTE This is just here because otherwise prettier
                     * goes crazy and suggest a wrong fix
                     */
                    action.hash || 0
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
                        status: action.status,
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
                  {action.status === 'succeeded' && (
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
                  {action.status === 'pending' && (
                    <div className={styles.spinner}>
                      <SpinnerLoader
                        appearance={{
                          size: 'small',
                          theme: 'primary',
                        }}
                      />
                    </div>
                  )}
                  {action.status === 'multisig' && (
                    <span className={styles.multisigAction} />
                  )}
                </div>
              </Tooltip>
            </Fragment>
          )}
          {!action.status && this.renderCancelInteraction(actionIndex)}
        </div>
      );
    }
    return null;
  }

  renderActionItem(action: TransactionType, actionIndex: number) {
    const { renderActionDescription } = GasStationCard;
    return (
      <li
        /*
         * @NOTE Nonces are unique, but our mock data might add duplicates.
         * In case you see duplicate key errors in the console, don't panic.
         */
        key={action.id}
        disabled={action.dependency}
        className={this.getActionItemClasses(action, actionIndex)}
      >
        {renderActionDescription(
          !!action.dependency,
          action.status,
          actionIndex,
        )}
        {this.renderActionStatus(action, actionIndex)}
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
      <button
        type="button"
        className={styles.main}
        onClick={onClick}
        disabled={expanded || !onClick}
      >
        <Card className={canWeExpand ? styles.cardExpanded : styles.card}>
          {this.renderSummary()}
          {canWeExpand ? (
            <ul className={styles.expanded}>
              {dependents.map((action, index) =>
                this.renderActionItem(action, index),
              )}
            </ul>
          ) : null}
        </Card>
      </button>
    );
  }
}

export default GasStationCard;
