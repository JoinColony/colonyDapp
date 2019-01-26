/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TransactionRecord } from '~immutable';

import Icon from '~core/Icon';
import CardList from '~core/CardList';

import styles from './TransactionDetails.css';

import GasStationCard from '../GasStationCard';
import GasStationClaimCard from '../GasStationClaimCard';
import GasStationPrice from '../GasStationPrice';

const MSG = defineMessages({
  returnToSummary: {
    id: 'users.GasStationPopover.GasStationContent.returnToSummary',
    defaultMessage: 'See all pending actions',
  },
});

type Props = {
  username: string,
  transaction: TransactionRecord<*, *>,
  onClose: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
};

const TransactionDetails = ({ transaction, username, onClose }: Props) => (
  <div>
    <button type="button" className={styles.returnToSummary} onClick={onClose}>
      <Icon
        appearance={{ size: 'small' }}
        name="caret-left"
        title={MSG.returnToSummary}
      />
      <FormattedMessage {...MSG.returnToSummary} />
    </button>
    <CardList appearance={{ numCols: '1' }}>
      {!username && <GasStationClaimCard />}
      <GasStationCard transaction={transaction} idx={0} expanded />
    </CardList>
    <GasStationPrice transaction={transaction} />
  </div>
);

export default TransactionDetails;
