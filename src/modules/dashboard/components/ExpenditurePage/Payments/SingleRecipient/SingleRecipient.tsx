import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useField } from 'formik';

import { FormSection } from '~core/Fields';
import Icon from '~core/Icon';
import Recipient from '~dashboard/ExpenditurePage/Recipient';
import { Props as RecipientProps } from '~dashboard/ExpenditurePage/Recipient/Recipient';
import { ErrorDot } from '~dashboard/ExpenditurePage/ErrorDot';

import CollapseExpandButtons from '../CollapseExpandButtons';
import { Recipient as RecipientType } from '../types';
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
});

interface Props extends Omit<RecipientProps, 'subscribedUsers'> {
  allRecipient: RecipientType[];
  colonyMembers: any;
  onToggleButtonClick: (index: number) => void;
  remove: (index: number) => void;
}

const SingleRecipient = ({
  allRecipient: recipients,
  recipient,
  index,
  colony,
  colonyMembers,
  sidebarRef,
  onToggleButtonClick,
  remove,
}: Props) => {
  const [, { error: recipientError }] = useField(`recipients[${index}]`);

  return (
    <div className={styles.singleRecipient} key={recipient.id}>
      <FormSection>
        <div className={styles.recipientLabel}>
          <CollapseExpandButtons
            isExpanded={!!recipient.isExpanded}
            onToogleButtonClick={() => onToggleButtonClick(index)}
            isLastitem={index === recipients?.length - 1}
          />
          <p className={styles.recipentTitle}>
            {index + 1}: <FormattedMessage {...MSG.recipient} />
          </p>
          {recipients?.length > 1 && (
            <Icon
              name="trash"
              className={styles.deleteIcon}
              onClick={() => remove(index)}
              title={MSG.deleteIconTitle}
            />
          )}
          {recipientError && (
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
        isLast={index === recipients?.length - 1}
        colony={colony}
      />
    </div>
  );
};

SingleRecipient.displayName = displayName;

export default SingleRecipient;
