/* eslint-disable max-len */
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { Recipient as RecipientType } from './types';
import styles from './Payments.css';
import { FormSection } from '~core/Fields';
import LockedRecipient from '../Recipient/LockedRecipient';
import UserMention from '~core/UserMention';
import { Colony } from '~data/index';
import { MSG } from './Payments';
import CollapseExpandButtons from './CollapseExpandButtons';
import Icon from '~core/Icon';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import { Tooltip } from '~core/Popover';

const displayName = 'dashboard.ExpenditurePage.LockedPayments';

interface Props {
  recipients?: RecipientType[];
  colony?: Colony;
  editForm: () => void;
  pendingChanges?: Partial<ValuesType>;
  forcedChanges?: boolean;
}

const LockedPayments = ({
  recipients,
  colony,
  editForm,
  pendingChanges,
  forcedChanges,
}: Props) => {
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

  const pendingCreations = pendingChanges?.recipients?.filter(
    (recipient) => recipient?.created,
  );

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
          const inPendingState = pendingChanges?.recipients?.find(
            (item) => item.id === recipient.id,
          );

          return (
            <div className={styles.singleRecipient} key={recipient.id}>
              <FormSection>
                <div className={styles.recipientNameWrapper}>
                  <div className={styles.recipientName}>
                    <CollapseExpandButtons
                      isExpanded={isOpen}
                      onToogleButtonClick={() => onToggleButtonClick(index)}
                      isLocked
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
                  {inPendingState && <div className={styles.dot} />}
                  {forcedChanges && (
                    <Tooltip content={<FormattedMessage {...MSG.newValue} />}>
                      <div className={classNames(styles.dot, styles.blue)} />
                    </Tooltip>
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
                  pendingChanges={pendingChanges}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.recipientContainer}>
        {pendingCreations?.map((newRecipient, index) => {
          return (
            <div className={styles.singleRecipient} key={newRecipient.id}>
              <FormSection>
                <div className={styles.recipientNameWrapper}>
                  <div className={styles.recipientName}>
                    {recipients ? index + recipients?.length + 1 : index + 1}:{' '}
                    <UserMention
                      username={
                        newRecipient.recipient?.profile.username ||
                        newRecipient.recipient?.profile.displayName ||
                        ''
                      }
                    />
                  </div>
                  <div className={styles.dot} />
                </div>
              </FormSection>
            </div>
          );
        })}
      </div>
    </div>
  );
};

LockedPayments.displayName = displayName;

export default LockedPayments;
