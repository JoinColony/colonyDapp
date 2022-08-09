import React, { ReactNode, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { FormSection } from '~core/Fields';
import UserMention from '~core/UserMention';
import { Tooltip } from '~core/Popover';
import { getRecipientTokens } from '~dashboard/ExpenditurePage/utils';
import { Colony } from '~data/index';
import Numeral from '~core/Numeral';

import CollapseExpandButtons from '../CollapseExpandButtons';
import { Recipient } from '../types';

import styles from './RecipientHeader.css';

export const MSG = defineMessages({
  newValue: {
    id: 'dashboard.ExpenditurePage.Payments.RecipientHeader.newValue',
    defaultMessage: 'New value. See activity feed.',
  },
  userHeader: {
    id: 'dashboard.ExpenditurePage.Payments.RecipientHeader.userHeader',
    defaultMessage: `{count}: {name}, {value}`,
  },
  delay: {
    id: 'dashboard.ExpenditurePage.Payments.RecipientHeader.delay',
    defaultMessage: `, {amount}{time}`,
  },
});

const displayName = 'dashboard.ExpenditurePage.Payments.RecipientHeader';

interface Props {
  isOpen: boolean;
  onToggleButtonClick: (index: any) => void;
  inPendingState: boolean;
  recipient: Recipient;
  index: number;
  colony: Colony;
  ClaimTag?: ReactNode;
}

const RecipientHeader = ({
  isOpen,
  onToggleButtonClick,
  inPendingState,
  recipient,
  index,
  colony,
  ClaimTag,
}: Props) => {
  const recipientValues = useMemo(() => getRecipientTokens(recipient, colony), [
    colony,
    recipient,
  ]);

  return (
    <FormSection>
      <div className={styles.recipientNameWrapper}>
        <div className={styles.recipientName}>
          <CollapseExpandButtons
            isExpanded={isOpen}
            onToogleButtonClick={() => onToggleButtonClick(index)}
            isLocked
          />
          <div className={styles.header}>
            <div className={styles.name}>
              <FormattedMessage
                {...MSG.userHeader}
                values={{
                  count: index + 1,
                  name: (
                    <UserMention
                      username={
                        recipient.recipient?.profile.username ||
                        recipient.recipient?.profile.displayName ||
                        ''
                      }
                    />
                  ),
                  value: recipientValues?.map(
                    ({ amount, token }, idx) =>
                      token &&
                      amount && (
                        <div className={styles.value} key={idx}>
                          <Numeral value={amount} />
                          {token.symbol}
                        </div>
                      ),
                  ),
                }}
              />
              {recipient.delay?.amount && (
                <FormattedMessage
                  {...MSG.delay}
                  values={{
                    amount: recipient.delay.amount,
                    time:
                      // eslint-disable-next-line no-nested-ternary
                      recipient.delay.time === 'months'
                        ? recipient.delay.amount === '1'
                          ? 'mth'
                          : 'mths'
                        : recipient.delay.time.slice(0, 1),
                  }}
                />
              )}
            </div>
            {ClaimTag}
          </div>
        </div>
        {inPendingState ? (
          <div className={styles.dot} />
        ) : (
          recipient.isChanged && (
            <Tooltip content={<FormattedMessage {...MSG.newValue} />}>
              <div className={classNames(styles.dot, styles.blue)} />
            </Tooltip>
          )
        )}
      </div>
    </FormSection>
  );
};

RecipientHeader.displayName = displayName;

export default RecipientHeader;
