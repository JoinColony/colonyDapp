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
  defaultRecipientLabel: {
    id: 'dashboard.Expenditures.Recipient.defaultRecipientLabel',
    defaultMessage: 'Recipient',
  },
  defaultValueLabel: {
    id: 'dashboard.Expenditures.Recipient.defaultValueLabel',
    defaultMessage: 'Value',
  },
  defaultDelayLabel: {
    id: 'dashboard.Expenditures.Recipient.defaultDelayLabel',
    defaultMessage: 'Claim delay',
  },
  tooltipMessageTitle: {
    id: 'dashboard.Expenditures.Recipient.tooltipMessageTitle',
    defaultMessage: 'Security delay for claiming funds.',
  },
  tooltipMessageDescription: {
    id: 'dashboard.Expenditures.Recipient.tooltipMessageDescription',
    defaultMessage: `F.ex. once the work is finished, recipient has to wait before funds can be claimed.`,
  },
  addTokenText: {
    id: 'dashboard.Expenditures.Recipient.addTokenText',
    defaultMessage: 'Another token',
  },
  removeTokenText: {
    id: 'dashboard.Expenditures.Recipient.removeTokenText',
    defaultMessage: 'Discard',
  },
  hoursLabel: {
    id: 'dashboard.Expenditures.Recipient.daysOptionLabel',
    defaultMessage: 'hours',
  },
  daysLabel: {
    id: 'dashboard.Expenditures.Recipient.daysOptionLabel',
    defaultMessage: 'days',
  },
  monthsLabel: {
    id: 'dashboard.Expenditures.Recipient.monthsOptionLabel',
    defaultMessage: 'months',
  },
  valueError: {
    id: 'dashboard.Expenditures.Recipient.valueError',
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
                label={MSG.defaultRecipientLabel}
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
                label={MSG.defaultValueLabel}
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
                <FormattedMessage {...MSG.defaultDelayLabel} />
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
