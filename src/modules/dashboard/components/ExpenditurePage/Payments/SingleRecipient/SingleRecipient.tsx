import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection } from '~core/Fields';
import Icon from '~core/Icon';
import Recipient from '~dashboard/ExpenditurePage/Recipient';
import { Props as RecipientProps } from '~dashboard/ExpenditurePage/Recipient/Recipient';
import { ErrorDot } from '~dashboard/ExpenditurePage/ErrorDot';

import CollapseExpandButtons from '../CollapseExpandButtons';
import styles from '../Payments.css';
import { Recipient as RecipientType } from '../types';
import useErrorRecipientField from './useErrorRecipientField';

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
  tooltipError: {
    id: 'dashboard.ExpenditurePage.Payments.SingleRecipient.tooltipError',
    defaultMessage: 'Delete recipient',
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
  const { value: tokens } = recipient;
  const hasErrorFields = useErrorRecipientField(index, tokens);

  return (
    <div className={styles.singleRecipient} key={recipient.id}>
      <FormSection>
        <div className={styles.recipientLabel}>
          <CollapseExpandButtons
            isExpanded={!!recipient.isExpanded}
            onToogleButtonClick={() => onToggleButtonClick(index)}
            isLastitem={index === recipients?.length - 1}
          />
          {index + 1}: <FormattedMessage {...MSG.recipient} />
          {recipients?.length > 1 && (
            <Icon
              name="trash"
              className={styles.deleteIcon}
              onClick={() => remove(index)}
              title={MSG.deleteIconTitle}
            />
          )}
          {hasErrorFields && (
            <ErrorDot tooltipContent="Required fields error" />
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
