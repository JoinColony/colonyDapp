import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { nanoid } from 'nanoid';

import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { Colony } from '~data/index';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';
import { Split } from '~dashboard/ExpenditurePage/Split/types';
import { Batch } from '~dashboard/ExpenditurePage/Batch/types';

import { isBatchValueType } from '../ChangedBatch/utils';

import styles from './NewValue.css';

export const MSG = defineMessages({
  newAmount: {
    id: 'dashboard.EditExpenditureDialog.NewValue.newAmount',
    defaultMessage: 'New amount',
  },
  none: {
    id: 'dashboard.EditExpenditureDialog.NewValue.none',
    defaultMessage: 'None',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.NewValue';

interface Props {
  colony: Colony;
  newValue: Recipient['value'] | Split['amount'] | Batch['value'];
}

const NewValue = ({ colony, newValue }: Props) => {
  const { tokens: colonyTokens } = colony || {};

  if (!newValue) {
    return (
      <div className={styles.row}>
        <FormattedMessage {...MSG.none} />
      </div>
    );
  }

  if (!Array.isArray(newValue)) {
    const token = colonyTokens?.find(
      (tokenItem) =>
        newValue.tokenAddress && tokenItem.address === newValue.tokenAddress,
    );

    return (
      <div className={styles.row}>
        <div>
          {newValue.value && token && (
            <div>
              <TokenIcon
                className={styles.tokenIcon}
                token={token}
                name={token.name || token.address}
              />
              <Numeral
                unit={getTokenDecimalsWithFallback(0)}
                value={newValue.value}
              />{' '}
              {token.symbol}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isBatchValueType(newValue)) {
    const multipleValues = newValue?.length > 1;

    return (
      <div
        className={classNames(styles.row, {
          [styles.valueLabel]: multipleValues,
          [styles.smallerPadding]: multipleValues,
        })}
      >
        <div>
          {newValue &&
            newValue.map((newValueItem, index) => {
              const { value, token } = newValueItem || {};
              if (!value || !token) {
                return null;
              }

              return (
                <div
                  className={styles.valueItem}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                >
                  <TokenIcon
                    className={styles.tokenIcon}
                    token={token}
                    name={token.name || token.address}
                  />
                  <Numeral
                    unit={getTokenDecimalsWithFallback(0)} // it's a mock value, must be replaced with a valid value
                    value={value}
                  />{' '}
                  {token.symbol}
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  const recipientValues = newValue?.map(({ amount, tokenAddress }) => {
    const token = colonyTokens?.find(
      (tokenItem) => tokenAddress && tokenItem.address === tokenAddress,
    );
    return {
      amount,
      token,
      key: nanoid(),
    };
  });
  const multipleValues = recipientValues && recipientValues?.length > 1;

  return (
    <div
      className={classNames(styles.row, {
        [styles.valueLabel]: multipleValues,
        [styles.smallerPadding]: multipleValues,
      })}
    >
      <div>
        {recipientValues?.map(
          ({ amount, token }, index) =>
            amount &&
            token && (
              <div className={styles.valueItem} key={index}>
                <TokenIcon
                  className={styles.tokenIcon}
                  token={token}
                  name={token.name || token.address}
                />
                <Numeral
                  unit={getTokenDecimalsWithFallback(0)}
                  value={amount}
                />{' '}
                {token.symbol}
              </div>
            ),
        )}
      </div>
    </div>
  );
};

NewValue.displayName = displayName;

export default NewValue;
