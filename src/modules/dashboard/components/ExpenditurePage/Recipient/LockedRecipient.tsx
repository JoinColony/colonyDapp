import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection, InputLabel } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { Recipient as RecipientType } from '../Payments/types';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { tokensData as tokens } from './constants';

import styles from './LockedRecipient.css';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~core/Numeral';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Delay from '../Delay';

const MSG = defineMessages({
  recipientLabel: {
    id: 'dashboard.ExpenditurePage.LockedRecipient.recipientLabel',
    defaultMessage: 'Recipient',
  },
  valueLabel: {
    id: 'dashboard.ExpenditurePage.LockedRecipient.valueLabel',
    defaultMessage: 'Value',
  },
  delayLabel: {
    id: 'dashboard.ExpenditurePage.LockedRecipient.delayLabel',
    defaultMessage: 'Claim delay',
  },
  tooltipMessageTitle: {
    id: 'dashboard.ExpenditurePage.LockedRecipient.tooltipMessageTitle',
    defaultMessage: 'Security delay for claiming funds.',
  },
  tooltipMessageDescription: {
    id: 'dashboard.ExpenditurePage.LockedRecipient.tooltipMessageDescription',
    defaultMessage: `F.ex. once the work is finished, recipient has to wait before funds can be claimed.`,
  },
  addTokenText: {
    id: 'dashboard.ExpenditurePage.LockedRecipient.addTokenText',
    defaultMessage: 'Another token',
  },
  removeTokenText: {
    id: 'dashboard.ExpenditurePage.LockedRecipient.removeTokenText',
    defaultMessage: 'Discard',
  },
  hoursLabel: {
    id: 'dashboard.ExpenditurePage.LockedRecipient.hoursLabel',
    defaultMessage: 'hours',
  },
  daysLabel: {
    id: 'dashboard.ExpenditurePage.LockedRecipient.daysLabel',
    defaultMessage: 'days',
  },
  monthsLabel: {
    id: 'dashboard.ExpenditurePage.LockedRecipient.monthsLabel',
    defaultMessage: 'months',
  },
  valueError: {
    id: 'dashboard.ExpenditurePage.LockedRecipient.valueError',
    defaultMessage: 'Value is required',
  },
});

interface Props {
  recipient: RecipientType;
}

const LockedRecipient = ({ recipient }: Props) => {
  const {
    isExpanded,
    recipient: {
      profile: { walletAddress, username, displayName },
    },
    delay,
  } = recipient;

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
            <div className={styles.itemContainer}>
              <InputLabel
                label={MSG.valueLabel}
                appearance={{
                  direction: 'horizontal',
                }}
              />
              <div className={styles.tokens}>
                {/* 
                  Tokens value is a mock. 
                  It has to be fetched from backend based on form value, I think.
                  Form store only token address. 
                */}
                {tokens?.map((token, idx) => (
                  <div className={styles.valueAmount} key={idx}>
                    <span className={styles.icon}>
                      <TokenIcon
                        className={styles.tokenIcon}
                        token={token}
                        name={token.name || token.address}
                      />
                    </span>

                    <Numeral
                      unit={getTokenDecimalsWithFallback(token.decimals)}
                      value={
                        token.balances[COLONY_TOTAL_BALANCE_DOMAIN_ID].amount
                      }
                    />
                    <span className={styles.symbol}>{token.symbol}</span>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
          <FormSection appearance={{ border: 'bottom' }}>
            <div className={styles.itemContainer}>
              <div className={styles.delay}>
                <FormattedMessage {...MSG.delayLabel} />
              </div>

              <div className={styles.delayControlsContainer}>
                <Delay amount={delay?.amount} time={delay?.time} />
              </div>
            </div>
          </FormSection>
        </div>
      )}
    </div>
  );
};

export default LockedRecipient;
