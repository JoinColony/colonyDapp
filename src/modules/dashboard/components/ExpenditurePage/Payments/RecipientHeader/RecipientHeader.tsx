import React, { ReactNode, useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
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
  activeMotion: {
    id: 'dashboard.ExpenditurePage.Payments.RecipientHeader.activeMotion',
    defaultMessage: 'There is an active Motion to change this payment.',
  },
  userHeader: {
    id: 'dashboard.ExpenditurePage.Payments.RecipientHeader.userHeader',
    defaultMessage: `{count}: {name}, {value}{comma} `,
  },
  token: {
    id: 'dashboard.ExpenditurePage.Payments.RecipientHeader.token',
    defaultMessage: `{amount} {token}`,
  },
  delay: {
    id: 'dashboard.ExpenditurePage.Payments.RecipientHeader.delay',
    defaultMessage: `{amount} {time}`,
  },
  itemName: {
    id: `dashboard.ExpenditurePage.Payments.RecipientHeader.itemName`,
    defaultMessage: 'recipient',
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
  const { formatMessage } = useIntl();

  return (
    <FormSection>
      <div className={styles.recipientNameWrapper}>
        <div className={styles.recipientName}>
          <CollapseExpandButtons
            isExpanded={isOpen}
            onToogleButtonClick={() => onToggleButtonClick(index)}
            itemName={formatMessage(MSG.itemName)}
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
                    ({ amount, token, key }) =>
                      token &&
                      amount && (
                        <div className={styles.tokenWrapper} key={key}>
                          <FormattedMessage
                            {...MSG.token}
                            values={{
                              amount: <Numeral value={amount} />,
                              token: token.symbol,
                            }}
                          />
                        </div>
                      ),
                  ),
                  comma: recipient.delay?.amount ? ',' : '',
                }}
              />
              {recipient.delay?.amount && (
                <FormattedMessage
                  {...MSG.delay}
                  values={{
                    amount: recipient.delay.amount,
                    time: recipient.delay.time,
                  }}
                />
              )}
            </div>
            {inPendingState ? (
              <Tooltip content={<FormattedMessage {...MSG.activeMotion} />}>
                <div className={styles.dot} />
              </Tooltip>
            ) : (
              recipient.isChanged && (
                <Tooltip content={<FormattedMessage {...MSG.newValue} />}>
                  <div className={classNames(styles.dot, styles.blue)} />
                </Tooltip>
              )
            )}
            {ClaimTag}
          </div>
        </div>
      </div>
    </FormSection>
  );
};

RecipientHeader.displayName = displayName;

export default RecipientHeader;
