import React from 'react';
import { defineMessages } from 'react-intl';
import { useField } from 'formik';

import { Input, InputStatus } from '~core/Fields';
import { Colony } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { Rate } from '../types';

import styles from './Limit.css';

const MSG = defineMessages({
  notSet: {
    id: 'dashboard.ExpenditurePage.Streaming.Limit.notSet',
    defaultMessage: 'Not set',
  },
  limit: {
    id: 'dashboard.ExpenditurePage.Streaming.Limit.limit',
    defaultMessage: 'Limit',
  },
});

const displayName = 'dashboard.ExpenditurePage.Streaming.Limit';

interface Props {
  colony: Colony;
  name: string;
  rate: Rate;
}

const Limit = ({ colony, name, rate }: Props) => {
  const [, { error }] = useField(name);

  const token = colony.tokens?.find(
    (tokenItem) => rate.token && tokenItem.address === rate.token,
  );

  if (!token) {
    return null;
  }

  return (
    <>
      <div className={styles.limitContainer}>
        <div className={styles.inputContainer}>
          <Input
            name={name}
            appearance={{
              theme: 'underlined',
              size: 'small',
            }}
            label={MSG.limit}
            placeholder={MSG.notSet}
            formattingOptions={{
              numeral: true,
              numeralDecimalScale: 10,
            }}
            elementOnly
          />
        </div>
        <div className={styles.tokenIconWrapper}>
          <TokenIcon
            className={styles.tokenIcon}
            token={token}
            name={token.name || token.address}
          />
          {token.symbol}
        </div>
      </div>
      <InputStatus error={error} />
    </>
  );
};

Limit.displayName = displayName;

export default Limit;