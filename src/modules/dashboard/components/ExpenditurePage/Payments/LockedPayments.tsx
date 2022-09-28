import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection } from '~core/Fields';
import UserMention from '~core/UserMention';

import { Colony } from '~data/index';
import { State, ValuesType } from '~pages/ExpenditurePage/types';
import Icon from '~core/Icon';

import { Stage, Status } from '../Stages/constants';
import LockedRecipient from '../Recipient/LockedRecipient/LockedRecipient';

import { Recipient as RecipientType } from './types';
import ClaimTag from './ClaimTag';
import RecipientHeader from './RecipientHeader';
import styles from './Payments.css';

const MSG = defineMessages({
  payments: {
    id: 'dashboard.ExpenditurePage.Payments.LockedPayments.payments',
    defaultMessage: 'Payments',
  },
  recipient: {
    id: 'dashboard.ExpenditurePage.Payments.LockedPayments.recipient',
    defaultMessage: 'Recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.ExpenditurePage.Payments.LockedPayments.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
  minusIconTitle: {
    id: 'dashboard.ExpenditurePage.Payments.LockedPayments.minusIconTitle',
    defaultMessage: 'Collapse a single recipient settings',
  },
  plusIconTitle: {
    id: 'dashboard.ExpenditurePage.Payments.LockedPayments.plusIconTitle',
    defaultMessage: 'Expand a single recipient settings',
  },
});

const displayName = 'dashboard.ExpenditurePage.Payments.LockedPayments';

interface Props {
  recipients?: RecipientType[];
  activeState?: State;
  colony?: Colony;
  editForm: () => void;
  pendingChanges?: Partial<ValuesType>;
  status?: Status;
  isCancelled?: boolean;
  pendingMotion?: boolean;
}

const LockedPayments = ({
  recipients,
  colony,
  editForm,
  pendingChanges,
  activeState,
  isCancelled,
  pendingMotion,
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
          {activeState?.id !== Stage.Claimed && (
            <span className={styles.editIcon}>
              <Icon
                name="edit"
                appearance={{ size: 'medium' }}
                title="Edit expenditure"
                onClick={editForm}
              />
            </span>
          )}
        </div>
        {recipients?.map(({ claimed, claimDate, ...recipient }, index) => {
          const isOpen =
            expandedRecipients?.find((idx) => idx === index) !== undefined;

          const inPendingState = pendingChanges?.recipients?.find(
            (item) => item.id === recipient.id,
          );

          return (
            <div className={styles.singleRecipient} key={recipient.id}>
              {colony && (
                <>
                  <RecipientHeader
                    isOpen={isOpen}
                    onToggleButtonClick={onToggleButtonClick}
                    inPendingState={!!inPendingState}
                    recipient={recipient}
                    index={index}
                    colony={colony}
                    ClaimTag={
                      activeState?.id === Stage.Released &&
                      claimDate &&
                      !isCancelled && (
                        <ClaimTag
                          claimDate={claimDate}
                          claimed={claimed}
                          activeState={activeState}
                          pendingMotion={pendingMotion}
                        />
                      )
                    }
                  />
                  <LockedRecipient
                    recipient={{
                      ...recipient,
                      isExpanded: isOpen,
                    }}
                    colony={colony}
                    pendingChanges={pendingChanges}
                  />
                </>
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
                    {recipients ? index + recipients?.length + 1 : index + 1}
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
