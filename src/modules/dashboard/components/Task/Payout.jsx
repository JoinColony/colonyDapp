// @flow

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

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
  reputation: {
    id: 'dashboard.task.taskEditDialog.reputation',
    defaultMessage: '{reputation} max rep',
  },
  ethUsd: {
    id: 'dashboard.task.taskEditDialog.ethUsd',
    defaultMessage: '~ USD {ethUsd}',
  },
});

type State = {
  ethUsd: null,
};

type Props = {
  amount: number,
  symbol: string,
  reputation: number,
  isEth: boolean,
  isNative: boolean,
};
class Payout extends Component<State, Props> {
  state = { editing: true };

  componentDidMount() {
    const { isEth } = this.props;
    if (isEth) {
      this.getEthToUsd();
    }
  }

  getEthToUsd = () => {};

  toggleEdit = () => {
    this.setState(prevState => ({
      editing: !prevState.editing,
    }));
  };

  render() {
    const { amount, symbol, reputation, isEth, isNative } = this.props;
    const { editing, ethUsd } = this.state;

    // TODO: Obviously link up with actual tokens :-)
    const mockOptions = [
      { label: 'CLNY', value: 1 },
      { label: 'ETH', value: 2 },
    ];

    return (
      <div>
        {editing ? (
          <div>
            <div className={styles.row}>
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
              <div className={styles.setAmount}>
                <Input
                  appearance={{ theme: 'minimal', align: 'right' }}
                  name="amount"
                  formattingOptions={{ numeral: true, delimiter: '.' }}
                />
              </div>
              <div className={styles.selectToken}>
                <Select options={mockOptions} name="symbol" />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.row}>
            <Heading appearance={{ size: 'small' }} text={MSG.amount} />
            {amount ? (
              <div>
                <div>
                  <span className={styles.amount}>{amount}</span>
                  <span>{symbol}</span>
                </div>
                {isNative && (
                  <div className={styles.reputation}>
                    <FormattedMessage
                      {...MSG.reputation}
                      values={{ reputation }}
                    />
                  </div>
                )}
                {isEth && (
                  <div className={styles.conversion}>
                    <FormattedMessage {...MSG.ethUsd} values={{ ethUsd }} />
                  </div>
                )}
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
