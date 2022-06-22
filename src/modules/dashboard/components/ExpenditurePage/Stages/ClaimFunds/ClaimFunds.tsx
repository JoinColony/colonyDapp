import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import classNames from 'classnames';

import { FormSection } from '~core/Fields';
import Tag from '~core/Tag';
import TimeRelativeShort from '~dashboard/ExpenditurePage/TimeRelativeShort/TimeRelativeShort';
import styles from './ClaimFunds.css';
import Button from '~core/Button';
import { buttonStyle } from '../Stages';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

const MSG = defineMessages({
  claim: {
    id: 'dashboard.Expenditures.Stages.ClaimFunds.claim',
    defaultMessage: 'Next claim',
  },
  claimFunds: {
    id: 'dashboard.Expenditures.Stages.ClaimFunds.claimFunds',
    defaultMessage: 'Claim funds',
  },
  totalClaimable: {
    id: 'dashboard.Expenditures.Stages.ClaimFunds.totalClaimable',
    defaultMessage: 'Total claimable',
  },
  claimableNow: {
    id: 'dashboard.Expenditures.Stages.ClaimFunds.claimableNow',
    defaultMessage: 'Claimable now',
  },
  claimed: {
    id: 'dashboard.Expenditures.Stages.ClaimFunds.claimed',
    defaultMessage: 'Claimed',
  },
});

interface Props {
  buttonAction?: () => void;
  buttonText?: string | MessageDescriptor;
  buttonIsActive: boolean;
}

const ClaimFunds = ({ buttonAction, buttonText, buttonIsActive }: Props) => {
  // tempprary mock values, should be fetched from the backend
  const claimDate = new Date(2022, 5, 24);
  const totalClaimable = [
    { amount: 500, symbol: 'xDAI', decimals: 0 },
    { amount: 50000, symbol: 'CLNY', decimals: 0 },
  ];
  const claimableNow = [{ amount: 50, symbol: 'xDAI', decimals: 0 }];
  const claimed = [{ amount: 5000, symbol: 'CLNY', decimals: 0 }];

  return (
    <div className={styles.container}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={classNames(styles.row, styles.firstRow)}>
          <span className={styles.label}>
            <FormattedMessage {...MSG.claimFunds} />
          </span>
          <div className={styles.tagWrapper}>
            <Tag
              appearance={{
                theme: 'golden',
                colorSchema: 'fullColor',
              }}
            >
              <FormattedMessage {...MSG.claim} />{' '}
              <TimeRelativeShort value={new Date(claimDate)} />
            </Tag>
          </div>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.row}>
          <span className={styles.label}>
            <FormattedMessage {...MSG.totalClaimable} />
          </span>
          <div className={styles.valueContainer}>
            {totalClaimable.map(({ decimals, amount, symbol }) => (
              <div className={styles.value}>
                <Numeral
                  unit={getTokenDecimalsWithFallback(decimals)}
                  value={amount}
                />{' '}
                {symbol}
              </div>
            ))}
          </div>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.row}>
          <span className={styles.label}>
            <FormattedMessage {...MSG.claimableNow} />
          </span>
          <div className={styles.valueContainer}>
            {claimableNow.map(({ amount, symbol, decimals }) => (
              <div className={styles.value}>
                <Numeral
                  unit={getTokenDecimalsWithFallback(decimals)}
                  value={amount}
                />{' '}
                {symbol}
              </div>
            ))}
          </div>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.row}>
          <span className={styles.label}>
            <FormattedMessage {...MSG.claimed} />
          </span>
          <div className={styles.valueContainer}>
            {claimed.map(({ amount, symbol, decimals }) => (
              <div className={styles.value}>
                <Numeral
                  unit={getTokenDecimalsWithFallback(decimals)}
                  value={amount}
                />{' '}
                {symbol}
              </div>
            ))}
          </div>
        </div>
      </FormSection>
      <div className={styles.buttonWrapper}>
        <Button
          onClick={buttonAction}
          style={buttonStyle}
          disabled={!buttonIsActive}
        >
          {typeof buttonText === 'string' ? (
            buttonText
          ) : (
            <FormattedMessage {...buttonText} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ClaimFunds;
