/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~components/core/Button';
import EthUsd from '~components/core/EthUsd';
import Heading from '~components/core/Heading';
import Input from '~components/core/Fields/Input';
import Select from '~components/core/Fields/Select';
import Numeral from '~components/core/Numeral';

import styles from './Payout.css';

const MSG = defineMessages({
  notSet: {
    id: 'dashboard.Task.Payout.notSet',
    defaultMessage: 'Not set',
  },
  reputation: {
    id: 'dashboard.Task.Payout.reputation',
    defaultMessage: '{reputation} max rep',
  },
});

type State = {
  editing: boolean,
};

type Props = {|
  name: string,
  amount?: string,
  symbol?: string,
  reputation?: number,
  isEth?: boolean,
  tokenOptions: Array<{ value: number, label: string }>,
  remove: () => void,
|};

class Payout extends Component<Props, State> {
  static displayName = 'dashboard.TaskEditDialog.Payout';

  state = { editing: false };

  toggleEdit = () => {
    this.setState(prevState => ({
      editing: !prevState.editing,
    }));
  };

  render() {
    const {
      amount,
      symbol,
      reputation,
      name,
      tokenOptions,
      isEth = false,
      remove,
    } = this.props;
    const { editing } = this.state;

    return (
      <div>
        <div hidden={!editing}>
          <div className={styles.row}>
            <Heading
              appearance={{ size: 'small', margin: 'small' }}
              text={{ id: 'label.amount' }}
            />
            <Button
              appearance={{ theme: 'blue', size: 'small' }}
              text={{ id: 'button.remove' }}
              onClick={remove}
            />
          </div>
          <div className={styles.editContainer}>
            <div className={styles.setAmount}>
              <Input
                appearance={{ theme: 'minimal', align: 'right' }}
                name={`${name}.amount`}
                formattingOptions={{ numeral: true, delimiter: ',' }}
              />
            </div>
            <div className={styles.selectToken}>
              <Select options={tokenOptions} name={`${name}.token`} />
            </div>
          </div>
        </div>
        <div hidden={editing}>
          <div className={styles.row}>
            <Heading
              appearance={{ size: 'small' }}
              text={{ id: 'label.amount' }}
            />
            {amount ? (
              <div className={styles.fundingDetails}>
                <div>
                  <span className={styles.amount}>
                    <Numeral
                      appearance={{ theme: 'grey', size: 'medium' }}
                      value={amount}
                    />
                  </span>
                  <span>{symbol}</span>
                </div>
                {reputation && (
                  <div className={styles.reputation}>
                    <FormattedMessage
                      {...MSG.reputation}
                      values={{ reputation }}
                    />
                  </div>
                )}
                {isEth && (
                  <div className={styles.conversion}>
                    <EthUsd
                      appearance={{ theme: 'grey', size: 'small' }}
                      value={amount}
                    />
                  </div>
                )}
              </div>
            ) : (
              <FormattedMessage {...MSG.notSet} />
            )}
            <Button
              appearance={{ theme: 'blue', size: 'small' }}
              text={{ id: 'button.modify' }}
              onClick={this.toggleEdit}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Payout;
