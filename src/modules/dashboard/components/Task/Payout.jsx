// @flow

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { getEthToUsd } from '~utils/external';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Input from '~core/Fields/Input';
import Select from '~core/Fields/Select';

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

type State = {
  ethUsd: number | null,
  editing: boolean,
};

type Props = {
  amount: number,
  symbol: string,
};
class Payout extends Component<Props, State> {
  state = { editing: false, ethUsd: null };

  componentDidMount() {
    const { isEth, amount } = this.props;

    if (isEth) {
      getEthToUsd(amount).then(dollar => {
        this.setState({ ethUsd: dollar });
      });
    }
  }

  toggleEdit = () => {
    this.setState(prevState => ({
      editing: !prevState.editing,
    }));
  };

  render() {
    const { amount, symbol } = this.props;
    const { editing } = this.state;
    const mockOptions = [
      { label: 'CLNY', value: 1 },
      { label: 'ETH', value: 2 },
    ];

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
            <div className={styles.editContainer}>
              <Input
                appearance={{ theme: 'minimal', align: 'right' }}
                name="amount"
                formattingOptions={{ numeral: true, delimiter: '.' }}
              />
              <Select options={mockOptions} name="symbol" />
            </div>
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
