import { FormikProps } from 'formik';
import React from 'react';
import { MessageDescriptor, defineMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import Button from '~core/Button';

import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';

import { useLoggedInUser } from '~data/index';
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
  }[];
  tokenDecimals: number;
  isLoading: boolean;
  buttonDisabled?: boolean;
  looadingText?: MessageDescriptor | string;
}

const VestingPageLayout = ({
  title,
  tableValues,
  buttonText,
  tokenDecimals,
  buttonTextValues,
  isLoading,
  isSubmitting,
  handleSubmit,
  buttonDisabled = false,
  looadingText = MSG.loading,
}: Props & FormikProps<{}>) => {
  const { username: currentUserName, ethereal } = useLoggedInUser();

  return isLoading ? (
    <div className={styles.loader}>
      <SpinnerLoader
        loadingText={looadingText}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    </div>
  ) : (
    <div className={styles.main}>
      {title}
      <div className={styles.table}>
        {tableValues.map(({ label, value }) => (
          <div className={styles.item} key={nanoid()}>
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
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={buttonDisabled || !currentUserName || ethereal}
        />
      </div>
    </div>
  );
};

VestingPageLayout.displayName = displayName;

export default VestingPageLayout;
