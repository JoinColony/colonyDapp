import React, { useMemo } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl,
} from 'react-intl';
import classNames from 'classnames';

import { FormSection } from '~core/Fields';
import Tag from '~core/Tag';
import TimeRelativeShort from '~dashboard/ExpenditurePage/TimeRelativeShort/TimeRelativeShort';
import Button from '~core/Button';
import Numeral from '~core/Numeral';

import { buttonStyles } from '../Stages';
import styles from './ClaimFunds.css';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';
import { Colony } from '~data/index';
import { getRecipientTokens } from '~dashboard/ExpenditurePage/utils';
import { useCalculateTokens } from '~dashboard/ExpenditurePage/hooks';

const displayName = 'dashboard.ExpenditurePage.ClaimFunds';

const MSG = defineMessages({
  claim: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFunds.claim',
    defaultMessage: 'Next claim {claimDate}',
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
    defaultMessage: 'now',
  },
});

export type TokensAmount = Record<string, number>;

interface Props {
  buttonAction?: () => void;
  buttonText?: string | MessageDescriptor;
  recipients?: Recipient[];
  colony?: Colony;
}

const ClaimFunds = ({
  buttonAction,
  buttonText,
  recipients,
  colony,
}: Props) => {
  const { formatMessage } = useIntl();

  const recipientsWithTokens = useMemo(() => {
    return recipients?.map((recipient) => {
      const token = getRecipientTokens(recipient, colony);
      return { ...recipient, value: token };
    });
  }, [colony, recipients]);

  const {
    claimableNow,
    claimed,
    totalClaimable,
    nextClaim,
    buttonIsActive,
  } = useCalculateTokens(recipientsWithTokens as Recipient[]);

  const nextClaimLabel = useMemo(() => {
    if (!nextClaim || !nextClaim.claimDate) {
      return <FormattedMessage {...MSG.nothingToClaim} />;
    }
    if (nextClaim?.claimDate < new Date().getTime() && !nextClaim.claimed) {
      // if the claim date has passed and the amount hasn't been claimed yet
      return formatMessage(MSG.claim, {
        claimDate: <FormattedMessage {...MSG.now} />,
      });
    }
    return formatMessage(MSG.claim, {
      claimDate: <TimeRelativeShort value={new Date(nextClaim.claimDate)} />,
    });
  }, [formatMessage, nextClaim]);

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
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.row}>
          <span className={styles.label}>
            <FormattedMessage {...MSG.totalClaimable} />
          </span>
          <div className={styles.valueContainer}>
            {totalClaimable?.map(({ amount, token }) => (
              <div className={styles.value} key={`${token?.id}-total`}>
                <Numeral value={amount || 0} /> {token?.symbol}
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
            {claimableNow?.map(({ amount, token }) => (
              <div className={styles.value} key={`${token?.id}-now`}>
                <Numeral value={amount || 0} /> {token?.symbol}
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
            {claimed?.map(({ amount, token }) => (
              <div className={styles.value} key={`${token?.id}-claimed`}>
                <Numeral value={amount || 0} /> {token?.symbol}
              </div>
            ))}
          </div>
        </div>
      </FormSection>
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
