import React, { useMemo } from 'react';
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
    defaultMessage: '{count}: {name}, {value}, {delay}',
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
}

const RecipientHeader = ({
  isOpen,
  onToggleButtonClick,
  inPendingState,
  recipient,
  index,
  colony,
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
              delay: recipient?.delay?.amount && (
                <span>
                  {recipient.delay.amount}
                  {recipient.delay.time.substring(0, 1)}
                </span>
              ),
            }}
          />
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
