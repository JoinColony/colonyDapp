import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useField } from 'formik';

import { FormSection } from '~core/Fields';
import Icon from '~core/Icon';
import { MembersSubscription } from '~data/generated';
import Recipient from '~dashboard/ExpenditurePage/Recipient';
import { Props as RecipientProps } from '~dashboard/ExpenditurePage/Recipient/Recipient';
import { ErrorDot } from '~dashboard/ExpenditurePage/ErrorDot';

import CollapseExpandButtons from '../CollapseExpandButtons';
import styles from '../Payments.css';

const displayName = 'dashboard.ExpenditurePage.Payments.SingleRecipient';

export const MSG = defineMessages({
  recipient: {
    id: 'dashboard.ExpenditurePage.Payments.SingleRecipient.recipient',
    defaultMessage: 'Recipient',
  },
  deleteIconTitle: {
    id: 'dashboard.ExpenditurePage.Payments.SingleRecipient.deleteIconTitle',
    defaultMessage: 'Delete recipient',
  },
  titleTooltipError: {
    id: 'dashboard.ExpenditurePage.Payments.SingleRecipient.titleTooltipError',
    defaultMessage: 'Required field error',
  },
  itemName: {
    id: `dashboard.ExpenditurePage.Payments.SingleRecipient.itemName`,
    defaultMessage: 'recipient',
  },
});

interface Props extends Omit<RecipientProps, 'subscribedUsers'> {
  colonyMembers: MembersSubscription | undefined;
  onToggleButtonClick: (index: number) => void;
  remove: (index: number) => void;
  isLastItem?: boolean;
  multipleRecipients?: boolean;
}

const SingleRecipient = ({
  recipient,
  index,
  colony,
  colonyMembers,
  sidebarRef,
  onToggleButtonClick,
  remove,
  isLastItem,
  multipleRecipients,
}: Props) => {
  const [, { error: recipientError, touched }] = useField(
    `recipients[${index}]`,
  );
  const { formatMessage } = useIntl();

  return (
    <div className={styles.singleRecipient} key={recipient.id}>
      <FormSection>
        <div className={styles.recipientLabel}>
          <CollapseExpandButtons
            isExpanded={!!recipient.isExpanded}
            onToogleButtonClick={() => onToggleButtonClick(index)}
            isLastItem={isLastItem}
            itemName={formatMessage(MSG.itemName)}
          />
          <p className={styles.recipientTitle}>
            {index + 1}: <FormattedMessage {...MSG.recipient} />
          </p>
          {multipleRecipients && (
            <Icon
              name="trash"
              className={styles.deleteIcon}
              onClick={() => remove(index)}
              title={MSG.deleteIconTitle}
            />
          )}
          {recipientError && touched && (
            <div className={styles.errorDotContainer}>
              <ErrorDot
                tooltipContent={<FormattedMessage {...MSG.titleTooltipError} />}
              />
            </div>
          )}
        </div>
      </FormSection>
      <Recipient
        {...{
          recipient,
          index,
          sidebarRef,
        }}
        subscribedUsers={colonyMembers?.subscribedUsers || []}
        isLast={isLastItem}
        colony={colony}
      />
    </div>
  );
};

SingleRecipient.displayName = displayName;

export default SingleRecipient;
