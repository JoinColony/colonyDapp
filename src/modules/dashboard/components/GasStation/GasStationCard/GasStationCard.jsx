/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TransactionType } from '~types/transaction';

import Heading from '~core/Heading';
import Card from '~core/Card';
import Link from '~core/Link';
import { Tooltip } from '~core/Popover';
import UserMention from '~core/UserMention';

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
      pending {Waiting on {username} to sign}
      failed {Failed transaction. Try again}
      other {Generic transaction}
    }`,
  },
  dependentAction: {
    id: 'dashboard.GasStation.GasStationCard.dependentAction',
    defaultMessage: 'Dependent transaction',
  },
  /*
   * @NOTE Below this line are just temporary message desriptors as the actual
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

const displayName = 'dashboard.GasStation.GasStationCard';

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

const GasStationCard = ({
  transaction: { status, set = [] },
  expanded = false,
  onClick,
}: Props) => {
  const haveActions = set && set.length;
  const canWeExpand = expanded && haveActions;
  return (
    <button
      type="button"
      className={styles.main}
      onClick={onClick}
      disabled={expanded || !onClick}
    >
      <Card className={canWeExpand ? styles.cardExpanded : styles.card}>
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
                {status && (
                  <Fragment>
                    {status === 'pending' && (
                      <span className={styles.pending} />
                    )}
                    {status === 'failed' && (
                      <span className={styles.failed}>!</span>
                    )}
                  </Fragment>
                )}
              </div>
            </Tooltip>
            {!status && haveActions ? (
              <span className={styles.counter}>{set.length}</span>
            ) : null}
          </div>
        </div>
        {canWeExpand ? (
          <ul className={styles.expanded}>
            {set.map((transaction: TransactionType, index) => (
              <li
                /*
                 * @NOTE Nonces are unique, but our mock data might add duplicates.
                 * In case you see duplicate key errors in the console, don't panic.
                 */
                key={transaction.nonce}
                disabled={transaction.dependency}
              >
                <div className={styles.description}>
                  <Tooltip
                    placement="top"
                    showArrow
                    content={
                      <span className={styles.tooltipContentReset}>
                        <FormattedMessage {...MSG.dependentAction} />
                      </span>
                    }
                    trigger={transaction.dependency ? 'hover' : 'disabled'}
                  >
                    {/*
                     * @NOTE The tooltip content needs to be wrapped inside a block
                     * element otherwise it won't detect the hover event
                     */}
                    <div>
                      <FormattedMessage
                        {...MSG.actionDescriptionSample}
                        values={{ index: index + 1 }}
                      />
                    </div>
                  </Tooltip>
                </div>
                {!transaction.dependency && (
                  <div className={styles.status}>
                    {/*
                     * @NOTE Can't use a `button` here since we're already a descendent of
                     * a button, and React will go nuts.
                     * Also, as jsx-a11y points out, it's better to use a `span`/`div`
                     * instead of an `a`, since that implies an anchor
                     */}
                    <span
                      role="button"
                      tabIndex={0}
                      className={styles.cancelAction}
                      /* eslint-disable-next-line no-console */
                      onClick={() => console.log('Action cancelled')}
                      /* eslint-disable-next-line no-console */
                      onKeyDown={() => console.log('Action cancelled')}
                    >
                      <FormattedMessage {...{ id: 'button.cancel' }} />
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </Card>
    </button>
  );
};

GasStationCard.displayName = displayName;

export default GasStationCard;
