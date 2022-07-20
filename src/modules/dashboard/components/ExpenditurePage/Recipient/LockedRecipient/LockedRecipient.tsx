import React, { useMemo } from 'react';
import classNames from 'classnames';

import { defineMessages, FormattedMessage } from 'react-intl';
import { FormSection, InputLabel } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { Recipient as RecipientType } from '../../Payments/types';
import TokenIcon from '~dashboard/HookedTokenIcon';

import styles from './LockedRecipient.css';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~core/Numeral';
import { Colony } from '~data/index';
import { getRecipientTokens } from '~dashboard/ExpenditurePage/utils';

export const MSG = defineMessages({
  recipientLabel: {
    id: 'dashboard.ExpenditurePage.Recipient.recipientLabel',
    defaultMessage: 'Recipient',
  },
  valueLabel: {
    id: 'dashboard.ExpenditurePage.Recipient.valueLabel',
    defaultMessage: 'Value',
  },
  delayLabel: {
    id: 'dashboard.ExpenditurePage.Recipient.delayLabel',
    defaultMessage: 'Claim delay',
  },
  none: {
    id: 'dashboard.ExpenditurePage.Recipient.none',
    defaultMessage: 'None',
  },
});

const displayNameLockedRecipient = 'dashboard.ExpenditurePage.LockedRecipient';

interface Props {
  recipient: RecipientType;
  colony: Colony;
}

const LockedRecipient = ({ recipient, colony }: Props) => {
  const {
    isExpanded,
    recipient: {
      profile: { walletAddress, username, displayName },
    },
    delay,
  } = recipient;

  const recipientValues = useMemo(() => getRecipientTokens(recipient, colony), [
    colony,
    recipient,
  ]);

  return (
    <div>
      {isExpanded && (
        <div className={styles.formContainer}>
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.userContainer}>
              <InputLabel
                label={MSG.recipientLabel}
                appearance={{
                  direction: 'horizontal',
                }}
              />
              <div className={styles.userAvatarContainer}>
                <UserAvatar address={walletAddress} size="xs" notSet={false} />
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
              <InputLabel
                label={MSG.valueLabel}
                appearance={{
                  direction: 'horizontal',
                }}
              />
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

          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.itemContainer}>
              <InputLabel
                label={MSG.delayLabel}
                appearance={{
                  direction: 'horizontal',
                }}
              />
              <span className={styles.delayControlsContainer}>
                {delay?.amount ? (
                  <>
                    {delay.amount} {delay.time}
                  </>
                ) : (
                  <FormattedMessage {...MSG.none} />
                )}
              </span>
            </div>
          </FormSection>
        </div>
      )}
    </div>
  );
};

LockedRecipient.displayName = displayNameLockedRecipient;

export default LockedRecipient;
