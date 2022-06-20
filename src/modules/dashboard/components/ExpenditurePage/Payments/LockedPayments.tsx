import React, { useCallback, useState } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';
import { Recipient as RecipientType } from './types';

import styles from './Payments.css';
import Icon from '~core/Icon';
import { FormSection } from '~core/Fields';
import LockedRecipient from '../Recipient/LockedRecipient';
import UserMention from '~core/UserMention';
// import { RemainingTime } from '~dashboard/CoinMachine/RemainingDisplayWidgets';
// import TimerValue from '~core/TimerValue';
// import useSplitTime from '~utils/hooks/useSplitTime';
import TimeRelative from '~core/TimeRelative';
import Tag from '~core/Tag';

const MSG = defineMessages({
  payments: {
    id: 'dashboard.Expenditures.Payments.defaultPayment',
    defaultMessage: 'Payments',
  },
  recipient: {
    id: 'dashboard.Expenditures.Payments.defaultRrecipient',
    defaultMessage: 'Recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.Expenditures.Payments.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
  minusIconTitle: {
    id: 'dashboard.Expenditures.Payments.minusIconTitle',
    defaultMessage: 'Collapse a single recipient settings',
  },
  plusIconTitle: {
    id: 'dashboard.Expenditures.Payments.plusIconTitle',
    defaultMessage: 'Expand a single recipient settings',
  },
});

interface Props {
  recipients?: RecipientType[];
  editForm?: () => void;
}

const LockedPayments = ({ recipients, editForm }: Props) => {
  const [expandedRecipients, setExpandedRecipients] = useState<
    number[] | undefined
  >(recipients?.map((_, idx) => idx));

  const onToggleButtonClick = useCallback((index) => {
    setExpandedRecipients((expandedIndexes) => {
      const isOpen = expandedIndexes?.find((expanded) => expanded === index);

      if (isOpen !== undefined) {
        return expandedIndexes?.filter((idx) => idx !== index);
      }
      return [...(expandedIndexes || []), index];
    });
  }, []);

  // const value = 1655714131040;
  // const periodLength = 30;

  // const { splitTime, timeLeft } = useSplitTime(
  //   value / 1000,
  //   true,
  //   periodLength / 1000,
  // );

  // const showValueWarning =
  // appearance.theme !== 'danger' &&
  // typeof value === 'number' &&
  // periodLength !== undefined &&
  // (timeLeft * 1000 * 100) / periodLength <= 10;

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.recipientContainer}>
        <div className={styles.payments}>
          <FormattedMessage {...MSG.payments} />
          <Icon
            name="edit"
            className={styles.editIcon}
            title="Edit expenditure"
            onClick={editForm}
          />
        </div>
        {recipients?.map((recipient, index) => {
          const isOpen =
            expandedRecipients?.find((idx) => idx === index) !== undefined;

          return (
            <div
              className={styles.singleRecipient}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
            >
              <FormSection appearance={{ border: 'bottom' }}>
                <div className={styles.recipientNameWrapper}>
                  <div className={styles.recipientName}>
                    {isOpen ? (
                      <>
                        <Icon
                          name="minus"
                          onClick={() => onToggleButtonClick(index)}
                          className={styles.signWrapper}
                          title={MSG.minusIconTitle}
                        />
                        <div className={styles.verticalDivider} />
                      </>
                    ) : (
                      <Icon
                        name="plus"
                        onClick={() => onToggleButtonClick(index)}
                        className={styles.signWrapper}
                        title={MSG.plusIconTitle}
                      />
                    )}
                    {index + 1}:{' '}
                    <UserMention
                      username={recipient.recipient.username || ''}
                    />
                    {', '}
                    {recipient?.delay?.amount}
                    {recipient?.delay?.time}
                  </div>
                  <div className={styles.tagWrapper}>
                    <Tag
                      appearance={{ theme: 'golden', colorSchema: 'fullColor' }}
                    >
                      Claim{' '}
                      <TimeRelative value={new Date(2022, 5, 20, 14, 0, 0)} />
                    </Tag>
                  </div>
                </div>
              </FormSection>
              <LockedRecipient
                recipient={{
                  ...recipient,
                  isExpanded: isOpen,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LockedPayments;
