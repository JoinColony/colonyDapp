/* @flow */

// $FlowFixMe until hooks flow types
import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BigNumber from 'bn.js';

import Button from '~core/Button';
import EthUsd from '~core/EthUsd';
import Heading from '~core/Heading';
import Input from '~core/Fields/Input';
import Select from '~core/Fields/Select';
import Numeral from '~core/Numeral';

import NetworkFee from './NetworkFee';

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

type Props = {|
  name: string,
  amount?: number | BigNumber,
  symbol?: string,
  decimals?: number,
  reputation?: number,
  isEth?: boolean,
  tokenOptions?: Array<{ value: number, label: string }>,
  editPayout?: boolean,
  remove?: () => void,
  canRemove?: boolean,
  reset?: () => void,
|};

const displayName = 'dashboard.TaskEditDialog.Payout';

const Payout = ({
  amount,
  symbol,
  decimals = 18,
  reputation,
  name,
  tokenOptions,
  isEth = false,
  canRemove = true,
  remove,
  reset,
  editPayout = true,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const exitEditAndCancel = useCallback(
    () => {
      if (isEditing && reset) {
        reset();
      }
      setIsEditing(false);
    },
    [isEditing, reset],
  );

  return (
    <div>
      <div hidden={!isEditing}>
        <div className={styles.row}>
          <Heading
            appearance={{ size: 'small', margin: 'small' }}
            text={{ id: 'label.amount' }}
          />
          <span>
            {canRemove && (
              <Button
                appearance={{ theme: 'blue', size: 'small' }}
                text={{ id: 'button.remove' }}
                onClick={remove}
              />
            )}
            <Button
              appearance={{ theme: 'blue', size: 'small' }}
              text={{ id: 'button.cancel' }}
              onClick={exitEditAndCancel}
            />
          </span>
        </div>
        <div className={styles.editContainer}>
          <div className={styles.setAmount}>
            <Input
              appearance={{ theme: 'minimal', align: 'right' }}
              name={`${name}.amount`}
              formattingOptions={{
                delimiter: ',',
                numeral: true,
                numeralDecimalScale: decimals,
              }}
            />
          </div>
          <div className={styles.selectToken}>
            <Select options={tokenOptions} name={`${name}.token`} />
          </div>
        </div>
      </div>
      <div hidden={isEditing}>
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
                    appearance={{
                      size: 'medium',
                      theme: 'grey',
                    }}
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
                onClick={() => setIsEditing(true)}
              />
            )}
          </div>
        </div>
        {amount && symbol && !isEditing && (
          <div className={styles.networkFeeRow}>
            <NetworkFee amount={amount} symbol={symbol} />
          </div>
        )}
      </div>
    </div>
  );
};

Payout.displayName = displayName;

export default Payout;
