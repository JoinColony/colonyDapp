import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { nanoid } from 'nanoid';

import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { Colony } from '~data/index';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';

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
  newValue: Recipient['value'];
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
      <div className={styles.valueContainer}>
        {recipientValues?.map(
          ({ amount, token }, index) =>
            amount &&
            token && (
              <div
                className={classNames(styles.value, {
                  [styles.paddingBottom]: multipleValues,
                })}
                key={index}
              >
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
