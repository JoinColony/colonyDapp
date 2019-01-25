/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BigNumber from 'bn.js';

import Button from '~core/Button';
import EthUsd from '~core/EthUsd';
import Heading from '~core/Heading';
import Input from '~core/Fields/Input';
import Select from '~core/Fields/Select';
import Numeral from '~core/Numeral';

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
  amount?: number | BigNumber,
  symbol?: string,
  reputation?: number,
  isEth?: boolean,
  tokenOptions?: Array<{ value: number, label: string }>,
  editPayout: boolean,
  remove?: () => void,
|};

class Payout extends Component<Props, State> {
  static displayName = 'dashboard.TaskEditDialog.Payout';

  static defaultProps = { editPayout: true };

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
      editPayout,
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
            <div>
              {editPayout && (
                <Button
                  appearance={{ theme: 'blue', size: 'small' }}
                  text={{ id: 'button.modify' }}
                  onClick={this.toggleEdit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Payout;
