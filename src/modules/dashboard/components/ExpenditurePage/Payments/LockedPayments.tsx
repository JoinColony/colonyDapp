import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Recipient as RecipientType } from './types';
import styles from './Payments.css';
import Icon from '~core/Icon';
import { FormSection } from '~core/Fields';
import LockedRecipient from '../Recipient/LockedRecipient';
import UserMention from '~core/UserMention';
import Delay from '../Delay';

const MSG = defineMessages({
  payments: {
    id: 'dashboard.ExpenditurePage.LockedPayments.payments',
    defaultMessage: 'Payments',
  },
  recipient: {
    id: 'dashboard.ExpenditurePage.LockedPayments.recipient',
    defaultMessage: 'Recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.ExpenditurePage.LockedPayments.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
  minusIconTitle: {
    id: 'dashboard.ExpenditurePage.LockedPayments.minusIconTitle',
    defaultMessage: 'Collapse a single recipient settings',
  },
  plusIconTitle: {
    id: 'dashboard.ExpenditurePage.LockedPayments.plusIconTitle',
    defaultMessage: 'Expand a single recipient settings',
  },
});

interface Props {
  recipients?: RecipientType[];
}

const LockedPayments = ({ recipients }: Props) => {
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

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.recipientContainer}>
        <div className={styles.payments}>
          <FormattedMessage {...MSG.payments} />
        </div>
        {recipients?.map((recipient, index) => {
          const isOpen =
            expandedRecipients?.find((idx) => idx === index) !== undefined;

          return (
            <div className={styles.singleRecipient} key={recipient.id}>
              <FormSection>
                <div className={styles.recipientName}>
                  {isOpen ? (
                    <>
                      <Icon
                        name="collapse"
                        onClick={() => onToggleButtonClick(index)}
                        className={styles.signWrapper}
                        title={MSG.minusIconTitle}
                      />
                      <div className={classNames(styles.verticalDivider)} />
                    </>
                  ) : (
                    <Icon
                      name="expand"
                      onClick={() => onToggleButtonClick(index)}
                      className={styles.signWrapper}
                      title={MSG.plusIconTitle}
                    />
                  )}
                  {index + 1}:{' '}
                  <UserMention
                    username={
                      recipient.recipient.profile.username ||
                      recipient.recipient.profile.displayName ||
                      ''
                    }
                  />
                  {', '}
                  <Delay
                    amount={recipient?.delay?.amount}
                    time={recipient?.delay?.time}
                  />
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
