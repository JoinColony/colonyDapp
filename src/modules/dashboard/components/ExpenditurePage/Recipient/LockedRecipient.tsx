import React, { useMemo } from 'react';
import classNames from 'classnames';

import { FormattedMessage } from 'react-intl';
import { FormSection, InputLabel } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { Recipient as RecipientType } from '../Payments/types';
import TokenIcon from '~dashboard/HookedTokenIcon';

import styles from './LockedRecipient.css';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~core/Numeral';
import { Colony } from '~data/index';
import { getRecipientTokens } from '../utils';
import { MSG } from './Recipient';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';

const displayNameLockedRecipient = 'dashboard.ExpenditurePage.LockedRecipient';

interface Props {
  recipient: RecipientType;
  colony: Colony;
  pendingChanges?: Partial<ValuesType>;
}

const LockedRecipient = ({ recipient, colony, pendingChanges }: Props) => {
  const { isExpanded, recipient: recipientItem, delay } = recipient;
  const { profile } = recipientItem || {};
  const { walletAddress, username, displayName } = profile || {};

  const recipientValues = useMemo(() => getRecipientTokens(recipient, colony), [
    colony,
    recipient,
  ]);

  const newPendingChange = pendingChanges?.recipients?.find(
    (item) => item.id === recipient.id,
  );

  return (
    <div>
      {isExpanded && (
        <div className={styles.formContainer}>
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.userContainer}>
              <div className={styles.pendingWrapper}>
                <InputLabel
                  label={MSG.recipientLabel}
                  appearance={{
                    direction: 'horizontal',
                  }}
                />
                {newPendingChange?.recipient && (
                  <div className={styles.pending}>
                    <FormattedMessage {...MSG.pending} />
                  </div>
                )}
              </div>
              <div className={styles.userAvatarContainer}>
                <UserAvatar
                  address={walletAddress || ''}
                  size="xs"
                  notSet={false}
                />
                <div className={styles.userName}>
                  <UserMention username={username || displayName || ''} />
                </div>
              </div>
            </div>
          </FormSection>
          <FormSection appearance={{ border: 'bottom' }}>
            <div
              className={classNames(styles.itemContainer, {
                [styles.tokensContainer]:
                  recipientValues && recipientValues.length > 1,
              })}
            >
              <div className={styles.pendingWrapper}>
                <InputLabel
                  label={MSG.valueLabel}
                  appearance={{
                    direction: 'horizontal',
                  }}
                />
                {newPendingChange?.value && (
                  <div className={styles.pending}>
                    <FormattedMessage {...MSG.pending} />
                  </div>
                )}
              </div>
              <div className={styles.tokens}>
                {recipientValues?.map(
                  ({ amount, token }, idx) =>
                    token &&
                    amount && (
                      <div className={styles.valueAmount} key={idx}>
                        <span className={styles.icon}>
                          <TokenIcon
                            className={styles.tokenIcon}
                            token={token}
                            name={token.name || token.address}
                          />
                        </span>

                        <Numeral
                          unit={getTokenDecimalsWithFallback(0)}
                          value={amount}
                        />
                        <span className={styles.symbol}>{token.symbol}</span>
                      </div>
                    ),
                )}
              </div>
            </div>
          </FormSection>
          {delay?.amount && (
            <FormSection appearance={{ border: 'bottom' }}>
              <div className={styles.itemContainer}>
                <div className={styles.pendingWrapper}>
                  <InputLabel
                    label={MSG.delayLabel}
                    appearance={{
                      direction: 'horizontal',
                    }}
                  />
                  {newPendingChange?.delay && (
                    <div className={styles.pending}>
                      <FormattedMessage {...MSG.pending} />
                    </div>
                  )}
                </div>
                <span className={styles.delayControlsContainer}>
                  {delay.amount} {delay.time}
                </span>
              </div>
            </FormSection>
          )}
        </div>
      )}
    </div>
  );
};

LockedRecipient.displayName = displayNameLockedRecipient;

export default LockedRecipient;