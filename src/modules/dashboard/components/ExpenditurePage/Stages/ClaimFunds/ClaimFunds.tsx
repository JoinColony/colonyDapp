import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import classNames from 'classnames';

import { FormSection } from '~core/Fields';
import Tag from '~core/Tag';
import Button from '~core/Button';

import { buttonStyles } from '../Stages';

import { ClaimData } from './types';
import ClaimTokens from './ClaimTokens';
import styles from './ClaimFunds.css';

const displayName = 'dashboard.ExpenditurePage.Stages.ClaimFunds';

const MSG = defineMessages({
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
});

export type TokensAmount = Record<string, number>;

interface Props {
  buttonAction?: () => void;
  buttonText?: string | MessageDescriptor;
  nextClaimLabel: JSX.Element;
  claimData: Omit<ClaimData, 'nextClaim'>;
  isDisabled?: boolean;
}

const ClaimFunds = ({
  buttonAction,
  buttonText,
  nextClaimLabel,
  isDisabled,
  claimData,
}: Props) => {
  const { totalClaimable, claimableNow, claimed, buttonIsActive } = claimData;

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
          <ClaimTokens tokens={totalClaimable} />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.row}>
          <span className={styles.label}>
            <FormattedMessage {...MSG.claimableNow} />
          </span>
          <ClaimTokens tokens={claimableNow} />
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.row}>
          <span className={styles.label}>
            <FormattedMessage {...MSG.claimed} />
          </span>
          <ClaimTokens tokens={claimed} />
        </div>
      </FormSection>
      <div className={styles.buttonWrapper}>
        <Button
          onClick={buttonAction}
          style={buttonStyles}
          disabled={!buttonIsActive || isDisabled}
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
