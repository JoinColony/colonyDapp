import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection } from '~core/Fields';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './LockedStaged.css';

const MSG = defineMessages({
  staged: {
    id: 'dashboard.ExpenditurePage.Staged.LockedStaged.staged',
    defaultMessage: 'Staged',
  },
  to: {
    id: 'dashboard.ExpenditurePage.Staged.LockedStaged.to',
    defaultMessage: 'To',
  },
  amount: {
    id: 'dashboard.ExpenditurePage.Staged.LockedStaged.amount',
    defaultMessage: 'Amount',
  },
});

const displayName = 'dashboard.ExpenditurePage.Staged.LockedStaged';

interface Props {
  colony: Colony;
  staged?: ValuesType['staged'];
}

const LockedStaged = ({ colony, staged }: Props) => {
  const { tokens: colonyTokens } = colony || {};

  const token = useMemo(() => {
    return colonyTokens?.find(
      (tokenItem) =>
        staged?.amount?.tokenAddress &&
        tokenItem.address === staged.amount?.tokenAddress,
    );
  }, [staged, colonyTokens]);

  return (
    <div className={styles.stagedContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.label}>
          <FormattedMessage {...MSG.staged} />
          <span className={styles.editIcon}>
            <Icon
              name="edit"
              appearance={{ size: 'medium' }}
              title="Edit expenditure"
              onClick={() => {}}
            />
          </span>
        </div>
      </FormSection>
      {staged?.user && (
        <FormSection appearance={{ border: 'bottom' }}>
          <div className={styles.userWrapper}>
            <FormattedMessage {...MSG.to} />
            <div className={styles.user}>
              <UserAvatar
                address={staged.user.profile.walletAddress}
                size="xs"
                notSet={false}
              />
              <UserMention
                username={
                  staged.user.profile.username ||
                  staged.user.profile.displayName ||
                  ''
                }
              />
            </div>
          </div>
        </FormSection>
      )}
      <FormSection appearance={{ border: 'bottom' }}>
        {token && (
          <div className={styles.valueWrapper}>
            <FormattedMessage {...MSG.amount} />
            <div className={styles.recipientAmountWrapper}>
              <TokenIcon
                className={styles.tokenIcon}
                token={token}
                name={token.name || token.address}
              />
              <Numeral
                unit={getTokenDecimalsWithFallback(0)}
                value={staged?.amount.value || 0}
              />
              {token.symbol}
            </div>
          </div>
        )}
      </FormSection>
      {staged?.milestones?.map((milestone) => {
        return (
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.milestoneWrapper}>
              <div className={styles.milestoneName}>{milestone.name}</div>
              <div className={styles.reserveWrapper}>
                <div className={styles.reserveBar}>
                  <div
                    className={styles.reserveIndicator}
                    style={{ width: `${milestone.percent || 0}%` }}
                  />
                </div>
                <span className={styles.percent}>
                  {milestone.percent || 0}%
                </span>
              </div>
              <div className={styles.amountWrapper}>
                <div className={styles.value}>
                  {token && (
                    <>
                      <TokenIcon
                        className={styles.tokenIcon}
                        token={token}
                        name={token.name || token.address}
                      />
                      <Numeral value={milestone.amount || 0} />
                      {token.symbol}
                    </>
                  )}
                </div>
              </div>
            </div>
          </FormSection>
        );
      })}
    </div>
  );
};

LockedStaged.displayName = displayName;

export default LockedStaged;
