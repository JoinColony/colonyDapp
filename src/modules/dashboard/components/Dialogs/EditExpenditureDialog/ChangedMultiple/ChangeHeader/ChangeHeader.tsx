import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { FormSection } from '~core/Fields';

import styles from './ChangeHeader.css';

export const MSG = defineMessages({
  newChange: {
    id: `dashboard.EditExpenditureDialog.ChangedMultiple.ChangeHeader.newChange`,
    defaultMessage: '{count}: {changeType}',
  },
  from: {
    id: `dashboard.EditExpenditureDialog.ChangedMultiple.ChangeHeader.from`,
    defaultMessage: 'From',
  },
  changeTo: {
    id: `dashboard.EditExpenditureDialog.ChangedMultiple.ChangeHeader.changeTo`,
    defaultMessage: 'Change to',
  },
  recipient: {
    id: `dashboard.EditExpenditureDialog.ChangedMultiple.ChangeHeader.recipient`,
    defaultMessage: 'Recipient',
  },
});

const displayName = `dashboard.EditExpenditureDialog.ChangedMultiple.ChangeHeader`;

interface Props {
  name?: string;
  index: number;
}

const ChangeHeader = ({ name, index }: Props) => {
  const { formatMessage } = useIntl();

  return (
    <div className={styles.header}>
      <FormattedMessage
        {...MSG.newChange}
        values={{
          count: index + 1,
          changeType:
            name === 'recipients' ? formatMessage(MSG.recipient) : name,
        }}
      />
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.subheader}>
          <span>
            <FormattedMessage {...MSG.from} />
          </span>
          <span>
            <FormattedMessage {...MSG.changeTo} />
          </span>
        </div>
      </FormSection>
    </div>
  );
};

ChangeHeader.displayName = displayName;

export default ChangeHeader;
