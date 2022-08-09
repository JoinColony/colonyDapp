import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection } from '~core/Fields';
import UserMention from '~core/UserMention';
import { State } from '~pages/ExpenditurePage/ExpenditurePage';
import { Colony } from '~data/index';

import { Stage } from '../Stages/constants';
import LockedRecipient from '../Recipient/LockedRecipient/LockedRecipient';

import CollapseExpandButtons from './CollapseExpandButtons';
import { Recipient as RecipientType } from './types';
import ClaimTag from './ClaimTag';
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
  isCancelled?: boolean;
  pendingMotion?: boolean;
}

const LockedPayments = ({
  recipients,
  activeState,
  colony,
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

  const displayDelay = useCallback(
    (recipientDelay: { amount?: string; time: string } | undefined) => {
      if (!recipientDelay) {
        return null;
      }

      const { amount, time } = recipientDelay;

      if (!amount) {
        return null;
      }

      if (time === 'months') {
        return amount === '1' ? `, ${amount}mth` : `, ${amount}mths`;
      }
      return `, ${amount}${time.slice(0, 1)}`;
    },
    [],
  );

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.recipientContainer}>
        <div className={styles.payments}>
          <FormattedMessage {...MSG.payments} />
        </div>
        {recipients?.map(({ claimed, claimDate, ...recipient }, index) => {
          const isOpen =
            expandedRecipients?.find((idx) => idx === index) !== undefined;
          const recipientName =
            recipient.recipient.profile.displayName ||
            recipient.recipient.profile.username ||
            '';

          return (
            <div className={styles.singleRecipient} key={recipient.id}>
              <FormSection>
                <div className={styles.recipientNameWrapper}>
                  <div className={styles.recipientName}>
                    <CollapseExpandButtons
                      isExpanded={isOpen}
                      onToogleButtonClick={() => onToggleButtonClick(index)}
                      isLastitem={index === recipients?.length - 1}
                      isLocked
                    />
                    {index + 1}: <UserMention username={recipientName} />
                    {displayDelay(recipient?.delay)}
                  </div>
                  {activeState?.id === Stage.Released &&
                    claimDate &&
                    !isCancelled && (
                      <ClaimTag
                        claimDate={claimDate}
                        claimed={claimed}
                        activeState={activeState}
                        pendingMotion={pendingMotion}
                      />
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
