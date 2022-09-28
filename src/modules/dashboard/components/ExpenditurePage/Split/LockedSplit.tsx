import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection } from '~core/Fields';
import { Colony } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { ValuesType } from '~pages/ExpenditurePage/types';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';

import styles from './Split.css';

const MSG = defineMessages({
  split: {
    id: 'dashboard.ExpenditurePage.Split.LockedSplit.split',
    defaultMessage: 'Split',
  },
  amount: {
    id: 'dashboard.ExpenditurePage.Split.LockedSplit.amount',
    defaultMessage: 'Amount',
  },
});

const displayName = 'dashboard.ExpenditurePage.Split.LockedSplit';

interface Props {
  colony: Colony;
  split?: ValuesType['split'];
}

const LockedSplit = ({ colony, split }: Props) => {
  const { amount, recipients } = split || {};
  const token = useMemo(() => {
    return colony.tokens?.find(
      (tokenItem) =>
        amount?.tokenAddress && tokenItem.address === amount?.tokenAddress,
    );
  }, [amount, colony]);

  return (
    <div className={styles.splitContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.split}>
          <FormattedMessage {...MSG.split} />
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
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.lockedAmount}>
          <FormattedMessage {...MSG.amount} />
          {token && (
            <div className={styles.amountWrapper}>
              <TokenIcon
                className={styles.tokenIcon}
                token={token}
                name={token.name || token.address}
              />
              <Numeral
                unit={getTokenDecimalsWithFallback(0)}
                value={amount?.value || 0}
              />
              {token.symbol}
            </div>
          )}
        </div>
      </FormSection>
      {recipients?.map((recipient) => {
        return (
          recipient?.user && (
            <FormSection appearance={{ border: 'bottom' }} key={recipient.key}>
              <div className={styles.lockedRecipient}>
                <div className={styles.userName}>
                  <UserAvatar
                    address={recipient.user.profile.walletAddress}
                    size="xs"
                    notSet={false}
                  />
                  <UserMention
                    username={
                      recipient.user.profile.username ||
                      recipient.user.profile.displayName ||
                      ''
                    }
                  />
                </div>
                {token && (
                  <div className={styles.recipientAmountWrapper}>
                    <TokenIcon
                      className={styles.tokenIcon}
                      token={token}
                      name={token.name || token.address}
                    />
                    <Numeral
                      unit={getTokenDecimalsWithFallback(0)}
                      value={recipient.amount || 0}
                    />
                    {token.symbol}
                  </div>
                )}
              </div>
            </FormSection>
          )
        );
      })}
    </div>
  );
};

LockedSplit.displayName = displayName;

export default LockedSplit;
