import React from 'react';
import { MessageDescriptor } from 'react-intl';
import Button from '~core/Button';

import Numeral from '~core/Numeral';
import { getFormattedTokenValue } from '~utils/tokens';

import styles from './Vesting.css';

const displayName = 'dashboard.Vesting.VestingPageLayout';

interface Props {
  title: JSX.Element;
  buttonText: MessageDescriptor | string;
  tableValues: {
    label: JSX.Element;
    value: string;
  }[];
  tokenDecimals: number;
}

const VestingPageLayout = ({
  title,
  tableValues,
  buttonText,
  tokenDecimals,
}: Props) => {
  return (
    <div className={styles.main}>
      {title}
      <div className={styles.table}>
        {tableValues.map(({ label, value }) => (
          <div className={styles.item}>
            <div className={styles.label}>{label}</div>
            <div className={styles.value}>
              <Numeral value={getFormattedTokenValue(value, tokenDecimals)} />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={buttonText}
        />
      </div>
    </div>
  );
};

VestingPageLayout.displayName = displayName;

export default VestingPageLayout;
