import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import BigNumber from 'bn.js';

import { Address } from '~types/index';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import Button from '~core/Button';
import EthUsd from '~core/EthUsd';
import Heading from '~core/Heading';
import Input from '~core/Fields/Input';
import Select from '~core/Fields/Select';
import Numeral from '~core/Numeral';
import { FullColonyFragment } from '~data/index';

import NetworkFee from '../NetworkFee';
import { tokenIsETH } from '../../../../core/checks';

import styles from './Payout.css';

const MSG = defineMessages({
  notSet: {
    id: 'dashboard.TaskEditDialog.Payout.notSet',
    defaultMessage: 'Not set',
  },
  reputation: {
    id: 'dashboard.TaskEditDialog.Payout.reputation',
    defaultMessage: '{reputation} max rep',
  },
  unknownToken: {
    id: 'dashboard.TaskEditDialog.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

interface Props {
  amount?: number | BigNumber;
  canRemove?: boolean;
  colonyAddress: Address;
  editPayout?: boolean;
  name: string;
  remove?: () => void;
  reputation?: number;
  reset?: () => void;
  token?: FullColonyFragment['tokens'][0];
  tokens?: FullColonyFragment['tokens'];
}

const displayName = 'dashboard.TaskEditDialog.Payout';

const Payout = ({
  amount,
  canRemove = true,
  editPayout = true,
  name,
  remove,
  reputation,
  reset,
  token,
  tokens,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const exitEditAndCancel = useCallback(() => {
    if (isEditing && reset) {
      reset();
    }
    setIsEditing(false);
  }, [isEditing, reset]);

  const isEth = useMemo(() => token && tokenIsETH(token), [token]);
  const tokenOptions =
    tokens &&
    tokens.map(({ address, details: { symbol } }) => ({
      value: address,
      label: symbol || MSG.unknownToken,
    }));

  const symbol = token && token.details.symbol;

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
                numeralDecimalScale: DEFAULT_TOKEN_DECIMALS,
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
              {isEth && !isEditing && (
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
            <NetworkFee
              amount={amount}
              decimals={DEFAULT_TOKEN_DECIMALS}
              symbol={symbol}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Payout.displayName = displayName;

export default Payout;
