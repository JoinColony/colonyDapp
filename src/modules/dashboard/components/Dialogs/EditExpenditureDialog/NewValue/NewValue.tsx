import { nanoid } from 'nanoid';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { getRecipientTokens } from '~dashboard/ExpenditurePage/utils';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { FormSection } from '~core/Fields';
import { Colony } from '~data/index';

import styles from './NewValue.css';

export const MSG = defineMessages({
  newAmount: {
    id: 'dashboard.EditExpenditureDialog.newAmount',
    defaultMessage: 'New amount',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.NewValue';

interface Props {
  colony: Colony;
  changedRecipient: any;
}

const NewValue = ({ colony, changedRecipient }: Props) => {
  const recipientValues = getRecipientTokens(changedRecipient, colony);
  const multipleValues = recipientValues && recipientValues?.length > 1;

  return (
    <FormSection appearance={{ border: 'bottom' }} key={nanoid()}>
      <div
        className={classNames(styles.row, {
          [styles.valueLabel]: multipleValues,
          [styles.smallerPadding]: multipleValues,
        })}
      >
        <div className={styles.label}>
          <FormattedMessage {...MSG.newAmount} />
        </div>
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
    </FormSection>
  );
};

NewValue.displayName = displayName;

export default NewValue;
