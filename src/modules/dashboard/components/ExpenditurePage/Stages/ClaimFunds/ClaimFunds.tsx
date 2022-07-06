import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import classNames from 'classnames';
import { nanoid } from 'nanoid';

import { FormSection } from '~core/Fields';
import Tag from '~core/Tag';
import TimeRelativeShort from '~dashboard/ExpenditurePage/TimeRelativeShort/TimeRelativeShort';
import styles from './ClaimFunds.css';
import Button from '~core/Button';
import { buttonStyles } from '../Stages';
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
  nothingToClaim: {
    id: 'dashboard.Expenditures.Stages.ClaimFunds.nothingToClaim',
    defaultMessage: 'Nothing to claim',
  },
});

export type Token = Record<string, number>;

interface Props {
  buttonAction?: () => void;
  buttonText?: string | MessageDescriptor;
  buttonIsActive: boolean;
  claimDate?: number;
  totalClaimable?: Token;
  claimableNow?: Token;
  claimed: Token;
}

const ClaimFunds = ({
  buttonAction,
  buttonText,
  buttonIsActive,
  claimDate,
  totalClaimable,
  claimableNow,
  claimed,
}: Props) => {
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
              {claimDate ? (
                <>
                  <FormattedMessage {...MSG.claim} />{' '}
                  <TimeRelativeShort value={new Date(claimDate)} />
                </>
              ) : (
                <FormattedMessage {...MSG.nothingToClaim} />
              )}
            </Tag>
          </div>
        </div>
      </FormSection>
      {totalClaimable && (
        <FormSection appearance={{ border: 'bottom' }}>
          <div className={styles.row}>
            <span className={styles.label}>
              <FormattedMessage {...MSG.totalClaimable} />
            </span>
            <div className={styles.valueContainer}>
              {Object.entries(totalClaimable)?.map(([amount, symbol]) => (
                <div className={styles.value} key={nanoid()}>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(0)}
                    value={amount || ''}
                  />{' '}
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        </FormSection>
      )}
      {claimableNow && (
        <FormSection appearance={{ border: 'bottom' }}>
          <div className={styles.row}>
            <span className={styles.label}>
              <FormattedMessage {...MSG.claimableNow} />
            </span>
            <div className={styles.valueContainer}>
              {Object.entries(claimableNow)?.map(([amount, symbol]) => (
                <div className={styles.value} key={nanoid()}>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(0)}
                    value={amount || ''}
                  />{' '}
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        </FormSection>
      )}
      {claimed && (
        <FormSection appearance={{ border: 'bottom' }}>
          <div className={styles.row}>
            <span className={styles.label}>
              <FormattedMessage {...MSG.claimed} />
            </span>
            <div className={styles.valueContainer}>
              {Object.entries(claimed).map(([amount, symbol]) => (
                <div className={styles.value} key={nanoid()}>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(0)}
                    value={amount || ''}
                  />{' '}
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        </FormSection>
      )}
      <div className={styles.buttonWrapper}>
        <Button
          onClick={buttonAction}
          style={buttonStyles}
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
