import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { FormSection } from '~core/Fields';
import UserMention from '~core/UserMention';
import { Tooltip } from '~core/Popover';

import CollapseExpandButtons from '../CollapseExpandButtons';
import { Recipient } from '../types';

import styles from './RecipientHeader.css';

export const MSG = defineMessages({
  newValue: {
    id: 'dashboard.ExpenditurePage.Payments.RecipientHeader.newValue',
    defaultMessage: 'New value. See activity feed.',
  },
});

const displayName = 'dashboard.ExpenditurePage.Payments.RecipientHeader';

interface Props {
  isOpen: boolean;
  onToggleButtonClick: (index: any) => void;
  inPendingState: boolean;
  recipient: Recipient;
  index: number;
}

const RecipientHeader = ({
  isOpen,
  onToggleButtonClick,
  inPendingState,
  recipient,
  index,
}: Props) => {
  return (
    <FormSection>
      <div className={styles.recipientNameWrapper}>
        <div className={styles.recipientName}>
          <CollapseExpandButtons
            isExpanded={isOpen}
            onToogleButtonClick={() => onToggleButtonClick(index)}
            isLocked
          />
          {index + 1}:
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
              {recipient.delay.amount}
              {recipient.delay.time.substring(0, 1)}
            </>
          )}
        </div>
        {inPendingState ? (
          <div className={styles.dot} />
        ) : (
          recipient.isChanged && (
            <Tooltip content={<FormattedMessage {...MSG.newValue} />}>
              <div className={classNames(styles.dot, styles.blue)} />
            </Tooltip>
          )
        )}
      </div>
    </FormSection>
  );
};

RecipientHeader.displayName = displayName;

export default RecipientHeader;
