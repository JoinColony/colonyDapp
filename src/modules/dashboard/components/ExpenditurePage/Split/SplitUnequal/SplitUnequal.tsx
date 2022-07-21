import { useFormikContext } from 'formik';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
// import classNames from 'classnames';

import { FormSection, Input, TokenSymbolSelector } from '~core/Fields';
import { Colony } from '~data/index';

import styles from './SplitUnequal.css';

import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';

const MSG = defineMessages({
  reserve: {
    id: 'dashboard.ExpenditurePage.Split.SplitUnequal.reserve',
    defaultMessage: 'Reserve',
  },
  amountLabel: {
    id: 'dashboard.ExpenditurePage.Split.amountLabel',
    defaultMessage: 'Amount',
  },
});

const displayName = 'dashboard.ExpenditurePage.Split';

interface Props {
  // sidebarRef: HTMLElement | null;
  colony: Colony;
}

const SplitUnequal = ({ colony }: Props) => {
  const { setFieldValue } = useFormikContext<ValuesType>();

  const { tokens: colonyTokens } = colony || {};
  const reservedPercentage = 75;

  return (
    <>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.valueContainer}>
          <div className={styles.inputContainer}>
            <Input
              name="split.amount.value"
              appearance={{
                theme: 'underlined',
                size: 'small',
              }}
              label={MSG.amountLabel}
              placeholder="Not set"
              formattingOptions={{
                numeral: true,
                numeralDecimalScale: 10,
              }}
              maxButtonParams={{
                setFieldValue,
                // mock, needs to be changed to the actual value
                maxAmount: '0',
                fieldName: 'split.amount.value',
              }}
            />
          </div>
          <div className={styles.tokenWrapper}>
            <div>
              <TokenSymbolSelector
                label=""
                tokens={colonyTokens}
                name="split.amount.tokenAddress"
                appearance={{ alignOptions: 'right', theme: 'grey' }}
                elementOnly
              />
            </div>
          </div>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.reserveWrapper}>
          <FormattedMessage {...MSG.reserve} />
          <div className={styles.reserveBar}>
            <div
              className={styles.reserveIndicator}
              style={{ width: `${reservedPercentage}%` }}
            />
          </div>
          <span className={styles.percent}>{reservedPercentage}%</span>
        </div>
      </FormSection>
    </>
  );
};
SplitUnequal.displayName = displayName;

export default SplitUnequal;
