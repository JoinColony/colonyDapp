// @flow

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Input from '~core/Fields/Input';

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
  cancel: {
    id: 'dashboard.task.taskEditDialog.cancel',
    defaultMessage: 'Cancel',
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
class Payout extends Component<State, Props> {
  state = { editing: true };

  toggleEdit = () => {
    this.setState(prevState => ({
      editing: !prevState.editing,
    }));
  };

  render() {
    const { amount, symbol } = this.props;
    const { editing } = this.state;
    return (
      <div>
        {editing ? (
          <div>
            <div className={styles.amountEditor}>
              <Heading
                appearance={{ size: 'small', margin: 'small' }}
                text={MSG.amount}
              />
              <Button
                appearance={{ theme: 'blue', size: 'small' }}
                text={MSG.cancel}
                onClick={this.toggleEdit}
              />
            </div>
            <Input
              appearance={{ theme: 'minimal', align: 'right' }}
              name="amount"
              formattingOptions={{ numeral: true, delimiter: ',' }}
            />
          </div>
        ) : (
          <div className={styles.amountEditor}>
            <Heading appearance={{ size: 'small' }} text={MSG.amount} />
            {amount ? (
              <div>
                <span className={styles.amount}>{amount}</span>
                <span>{symbol}</span>
              </div>
            ) : (
              <FormattedMessage {...MSG.notSet} />
            )}
            <Button
              appearance={{ theme: 'blue', size: 'small' }}
              text={MSG.modify}
              onClick={this.toggleEdit}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Payout;
