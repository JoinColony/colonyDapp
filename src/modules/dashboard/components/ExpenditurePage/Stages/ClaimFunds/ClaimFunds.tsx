import React, { useMemo } from 'react';
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
import Button from '~core/Button';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { buttonStyles } from '../Stages';
import styles from './ClaimFunds.css';

const displayName = 'dashboard.ExpenditurePage.ClaimFunds';

const MSG = defineMessages({
  claim: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFunds.claim',
    defaultMessage: 'Next claim',
  },
  claimFunds: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFunds.claimFunds',
    defaultMessage: 'Claim funds',
  },
  totalClaimable: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFunds.totalClaimable',
    defaultMessage: 'Total claimable',
  },
  claimableNow: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFunds.claimableNow',
    defaultMessage: 'Claimable now',
  },
  claimed: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFunds.claimed',
    defaultMessage: 'Claimed',
  },
  nothingToClaim: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFunds.nothingToClaim',
    defaultMessage: 'Nothing to claim',
  },
  now: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFunds.now',
    defaultMessage: 'Now',
  },
});

export type Token = Record<string, number>;

interface TokenWithId {
  symbol: string;
  amount: number;
  id: string;
}

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
  const convertToTokensWithIds = useMemo(
    () => (object: Token | undefined): TokenWithId[] => {
      if (!object) {
        return [];
      }

      return Object.entries(object).map(([symbol, amount]) => ({
        symbol,
        amount,
        id: nanoid(),
      }));
    },
    [],
  );

  const totalClaimableWithId = convertToTokensWithIds(totalClaimable);
  const claimableNowWithId = convertToTokensWithIds(claimableNow);
  const claimedWithId = convertToTokensWithIds(claimed);

  const nextClaimLabel = useMemo(() => {
    if (!claimDate) {
      return claimableNowWithId.length === 0 ? (
        <FormattedMessage {...MSG.nothingToClaim} />
      ) : (
        <div className={styles.claim}>
          <FormattedMessage {...MSG.now} />
        </div>
      );
    }
    return (
      <>
        <FormattedMessage {...MSG.claim} />{' '}
        <TimeRelativeShort value={new Date(claimDate)} />
      </>
    );
  }, [claimDate, claimableNowWithId]);

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
              {nextClaimLabel}
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
              {totalClaimableWithId.map(({ symbol, amount, id }) => (
                <div className={styles.value} key={id}>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(0)}
                    value={amount || 0}
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
              {claimableNowWithId.map(({ symbol, amount, id }) => (
                <div className={styles.value} key={id}>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(0)}
                    value={amount || 0}
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
              {claimedWithId.map(({ symbol, amount, id }) => (
                <div className={styles.value} key={id}>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(0)}
                    value={amount || 0}
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

ClaimFunds.displayName = displayName;

export default ClaimFunds;
