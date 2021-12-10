import React from 'react';
import { MessageDescriptor, defineMessage } from 'react-intl';
import Button from '~core/Button';

import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import { SimpleMessageValues } from '~types/index';
import { getFormattedTokenValue } from '~utils/tokens';

import styles from './Vesting.css';

const MSG = defineMessage({
  loading: {
    id: 'dashboard.Vesting.VestingPageLayout.loading',
    defaultMessage: 'Loading',
  },
});

const displayName = 'dashboard.Vesting.VestingPageLayout';

interface Props {
  title: JSX.Element;
  buttonText: MessageDescriptor | string;
  buttonTextValues?: SimpleMessageValues;
  tableValues: {
    label: JSX.Element;
    value: string;
    id: number;
  }[];
  tokenDecimals: number;
  isLoading: boolean;
}

const VestingPageLayout = ({
  title,
  tableValues,
  buttonText,
  tokenDecimals,
  buttonTextValues,
  isLoading,
}: Props) => {
  return isLoading ? (
    <div className={styles.loader}>
      <SpinnerLoader
        loadingText={MSG.loading}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    </div>
  ) : (
    <div className={styles.main}>
      {title}
      <div className={styles.table}>
        {tableValues.map(({ label, value }) => (
          <div className={styles.item} key={value}>
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
          textValues={buttonTextValues}
        />
      </div>
    </div>
  );
};

VestingPageLayout.displayName = displayName;

export default VestingPageLayout;
