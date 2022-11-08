import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { Colony } from '~data/index';
import { Rate } from '~dashboard/ExpenditurePage/Streaming/types';

import styles from './NewRate.css';

export const MSG = defineMessages({
  none: {
    id: 'dashboard.EditExpenditureDialog.NewRate.none',
    defaultMessage: 'None',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.NewRate';

interface Props {
  colony: Colony;
  newValue: Rate;
}

const NewRate = ({ colony, newValue }: Props) => {
  const { tokens: colonyTokens } = colony || {};

  if (!newValue) {
    return (
      <div className={styles.row}>
        <FormattedMessage {...MSG.none} />
      </div>
    );
  }

  const token = colonyTokens?.find(
    (tokenItem) => newValue.token && tokenItem.address === newValue.token,
  );

  return (
    <div className={styles.row}>
      <div>
        {newValue.amount && token && (
          <div>
            <TokenIcon
              className={styles.tokenIcon}
              token={token}
              name={token.name || token.address}
            />
            <Numeral
              unit={getTokenDecimalsWithFallback(0)} // 0 is a mock value
              value={newValue.amount}
            />{' '}
            {token.symbol}/{newValue.time}
          </div>
        )}
      </div>
    </div>
  );
};

NewRate.displayName = displayName;

export default NewRate;
