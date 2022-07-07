import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Recipient as RecipientType } from './types';
import styles from './Payments.css';
import { FormSection } from '~core/Fields';
import LockedRecipient from '../Recipient/LockedRecipient';
import UserMention from '~core/UserMention';
import { Colony } from '~data/index';
import { MSG } from './Payments';
import CollapseExpandButtons from './CollapseExpandButtons';
import Icon from '~core/Icon';

const displayName = 'dashboard.ExpenditurePage.LockedPayments';

interface Props {
  recipients?: RecipientType[];
  colony?: Colony;
  editForm: () => void;
}

const LockedPayments = ({ recipients, colony, editForm }: Props) => {
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
            <div className={styles.singleRecipient} key={recipient.id}>
              <FormSection>
                <div className={styles.recipientName}>
                  <CollapseExpandButtons
                    isExpanded={isOpen}
                    onToogleButtonClick={() => onToggleButtonClick(index)}
                    isLastitem={index === recipients?.length - 1}
                  />
                  {index + 1}:{' '}
                  <UserMention
                    username={
                      recipient.recipient?.profile.username ||
                      recipient.recipient?.profile.displayName ||
                      ''
                    }
                  />
                  {recipient?.delay?.amount && (
                    <>
                      {', '}
                      {recipient.delay.amount} {recipient.delay.time}
                    </>
                  )}
                </div>
              </FormSection>
              {colony && (
                <LockedRecipient
                  recipient={{
                    ...recipient,
                    isExpanded: isOpen,
                  }}
                  colony={colony}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

LockedPayments.displayName = displayName;

export default LockedPayments;
