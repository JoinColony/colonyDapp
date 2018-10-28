// @flow

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';

import styles from './Payout.css';

const MSG = defineMessages({
  amount: {
    id: 'dashboard.task.taskEditDialog.amount',
    defaultMessage: 'Amount',
  },
  modify: {
    id: 'dashboard.task.taskEditDialog.modify',
    defaultMessage: 'Modify',
  },
  notSet: {
    id: 'dashboard.task.taskEditDialog.notSet',
    defaultMessage: 'Not set',
  },
});

type Props = {
  amount: number,
  symbol: string,
};

export const Payout = ({ amount, symbol }: Props) => (
  <div className={styles.amountEditor}>
    <Heading appearance={{ size: 'small' }} text={MSG.amount} />
    <FormattedMessage {...MSG.notSet} />
    <Button appearance={{ theme: 'blue', size: 'small' }} text={MSG.modify} />
  </div>
);

export default Payout;
