/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { TransactionType } from '~types/transaction';

import Heading from '~core/Heading';
import Card from '~core/Card';
import Link from '~core/Link';

/*
 * @NOTE This is just temporary and should be replaced with a dynamic route
 * coming from the transaction object
 */
import { DASHBOARD_ROUTE } from '~routes';

import styles from './GasStationCard.css';

/*
 * @NOTE These are just temporary as the actual name / path combinations for
 * the various actions-transactions will be implemented in #542
 */
const MSG = defineMessages({
  transactionTitleSample: {
    id: 'dashboard.GasStation.GasStationCard.transactionTitleSample',
    defaultMessage: 'Create Task',
  },
  transactionDescriptionSample: {
    id: 'dashboard.GasStation.GasStationCard.transactionDescriptionSample',
    defaultMessage: 'The Meta Colony / #Javascript / Github Integration',
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
  transaction: { status, set },
  expanded = false,
  onClick,
}: Props) => (
  <button
    type="button"
    className={styles.main}
    onClick={onClick}
    disabled={!onClick}
  >
    <Card className={styles.card}>
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
          {status === 'pending' && <span className={styles.pending} />}
          {status === 'failed' && <span className={styles.failed}>!</span>}
        </div>
      )}
      {set && set.length ? (
        <div className={styles.status}>
          <span className={styles.counter}>{set.length}</span>
        </div>
      ) : null}
    </Card>
    {expanded && <div>This list is expanded</div>}
  </button>
);

GasStationCard.displayName = displayName;

export default GasStationCard;
