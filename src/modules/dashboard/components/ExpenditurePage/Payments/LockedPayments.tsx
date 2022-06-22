import React, { useCallback, useState } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';
import { Recipient as RecipientType } from './types';

import styles from './Payments.css';
import Icon from '~core/Icon';
import { FormSection } from '~core/Fields';
import LockedRecipient from '../Recipient/LockedRecipient/LockedRecipient';
import UserMention from '~core/UserMention';
import Tag from '~core/Tag';
import { Stage } from '../Stages/constants';
import TimeRelativeShort from '../TimeRelativeShort/TimeRelativeShort';
import Button from '~core/Button';
import Delay from '../Delay';
import { State } from '~pages/ExpenditurePage/ExpenditurePage';

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
  claim: {
    id: 'dashboard.Expenditures.Payments.claim',
    defaultMessage: 'Claim',
  },
  claimed: {
    id: 'dashboard.Expenditures.Payments.claimed',
    defaultMessage: 'Claimed',
  },
  claimNow: {
    id: 'dashboard.Expenditures.Payments.claimNow',
    defaultMessage: 'Claim now',
  },
});

type ExtendedRecipient = RecipientType & {
  claimDate: number;
  isClaimable: boolean;
};

interface Props {
  recipients?: ExtendedRecipient[];
  editForm?: () => void;
  activeState?: State;
}

const LockedPayments = ({ recipients, editForm, activeState }: Props) => {
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
    (isClaimable: boolean, claimDate: number) => {
      const hasPassed = claimDate < new Date().getTime();

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
      if (hasPassed) {
        return (
          <div className={styles.tagWrapper}>
            <Tag
              appearance={{
                theme: 'light',
              }}
            >
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
        {recipients?.map(({ isClaimable, claimDate, ...recipient }, index) => {
          const isOpen =
            expandedRecipients?.find((idx) => idx === index) !== undefined;

          return (
            <div className={styles.singleRecipient} key={recipient.id}>
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
                    <Delay
                      amount={recipient?.delay?.amount}
                      time={recipient?.delay?.time}
                    />
                  </div>
                  {activeState?.id === Stage.Released &&
                    renderTag(isClaimable, claimDate)}
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
