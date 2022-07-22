import React, { useCallback, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection } from '~core/Fields';
import UserMention from '~core/UserMention';
import Tag from '~core/Tag';
import Button from '~core/Button';
import { State } from '~pages/ExpenditurePage/ExpenditurePage';
import { Colony } from '~data/index';

import CollapseExpandButtons from './CollapseExpandButtons';
import { Stage } from '../Stages/constants';
import TimeRelativeShort from '../TimeRelativeShort/TimeRelativeShort';
import LockedRecipient from '../Recipient/LockedRecipient/LockedRecipient';
import { Recipient as RecipientType } from './types';
import styles from './Payments.css';

const MSG = defineMessages({
  payments: {
    id: 'dashboard.ExpenditurePage.Payments.defaultPayment',
    defaultMessage: 'Payments',
  },
  recipient: {
    id: 'dashboard.ExpenditurePage.Payments.defaultRrecipient',
    defaultMessage: 'Recipient',
  },
  addRecipientLabel: {
    id: 'dashboard.ExpenditurePage.Payments.addRecipientLabel',
    defaultMessage: 'Add recipient',
  },
  minusIconTitle: {
    id: 'dashboard.ExpenditurePage.Payments.minusIconTitle',
    defaultMessage: 'Collapse a single recipient settings',
  },
  plusIconTitle: {
    id: 'dashboard.ExpenditurePage.Payments.plusIconTitle',
    defaultMessage: 'Expand a single recipient settings',
  },
  claim: {
    id: 'dashboard.ExpenditurePage.Payments.claim',
    defaultMessage: 'Claim',
  },
  claimed: {
    id: 'dashboard.ExpenditurePage.Payments.claimed',
    defaultMessage: 'Claimed',
  },
  claimNow: {
    id: 'dashboard.ExpenditurePage.Payments.claimNow',
    defaultMessage: 'Claim now',
  },
});

const displayName = 'dashboard.ExpenditurePage.LockedPayments';

interface Props {
  recipients?: RecipientType[];
  activeState?: State;
  colony?: Colony;
}

const LockedPayments = ({ recipients, activeState, colony }: Props) => {
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

  const renderTag = useCallback(
    (claimDate: number | null, claimed?: boolean) => {
      if (!claimDate) {
        return null;
      }

      const isClaimable = claimDate < new Date().getTime() && !claimed;

      if (isClaimable) {
        return (
          <Button
            className={styles.claimButton}
            onClick={activeState?.buttonAction}
          >
            <FormattedMessage {...MSG.claimNow} />
          </Button>
        );
      }
      if (claimed) {
        return (
          <div className={styles.claimedTagWrapper}>
            <Tag>
              <FormattedMessage {...MSG.claimed} />
            </Tag>
          </div>
        );
      }
      return (
        <div className={styles.tagWrapper}>
          <Tag
            appearance={{
              theme: 'golden',
              colorSchema: 'fullColor',
            }}
          >
            <FormattedMessage {...MSG.claim} />{' '}
            <TimeRelativeShort value={new Date(claimDate)} formatting="short" />
          </Tag>
        </div>
      );
    },
    [activeState],
  );

  const displayDelay = useMemo(
    () => (recipientDelay: { amount?: string; time: string } | undefined) => {
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
                    renderTag(claimDate, claimed)}
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
