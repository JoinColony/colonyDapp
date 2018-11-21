// @flow

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { getEthToUsd } from '~utils/external';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Input from '~core/Fields/Input';
import Select from '~core/Fields/Select';
import Numeral from '~core/Numeral';

import styles from './Payout.css';

const MSG = defineMessages({
  notSet: {
    id: 'dashboard.task.Payout.notSet',
    defaultMessage: 'Not set',
  },
  reputation: {
    id: 'dashboard.task.Payout.reputation',
    defaultMessage: '{reputation} max rep',
  },
});

type State = {
  ethUsd: number | null,
  editing: boolean,
};

type Props = {
  name: string,
  amount?: string,
  symbol?: string,
  reputation?: number,
  isEth?: boolean,
  isNative?: boolean,
  tokenOptions: Array<Object>,
};
class Payout extends Component<Props, State> {
  state = { editing: false, ethUsd: null };

  componentDidMount() {
    const { isEth, amount } = this.props;

    if (isEth) {
      getEthToUsd(Number(amount)).then(dollar =>
        this.setState({ ethUsd: dollar }),
      );
    }
  }

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
      isEth,
      isNative,
      name,
      tokenOptions,
    } = this.props;
    const { editing, ethUsd } = this.state;

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
              text={{ id: 'button.cancel' }}
              onClick={this.toggleEdit}
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
                    <Numeral
                      appearance={{ theme: 'grey', size: 'small' }}
                      value={ethUsd}
                      prefix="~ "
                      suffix=" USD"
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
