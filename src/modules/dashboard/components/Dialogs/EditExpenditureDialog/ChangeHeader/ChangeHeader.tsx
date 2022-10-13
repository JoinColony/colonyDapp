import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormSection } from '~core/Fields';
import { capitalize } from '~utils/strings';

import styles from './ChangeHeader.css';

export const MSG = defineMessages({
  change: {
    id: `dashboard.EditExpenditureDialog.ChangeHeader.change`,
    defaultMessage: 'Change {name}',
  },
  from: {
    id: `dashboard.EditExpenditureDialog.ChangeHeader.from`,
    defaultMessage: 'From',
  },
  to: {
    id: `dashboard.EditExpenditureDialog.ChangeHeader.to`,
    defaultMessage: 'To',
  },
  changeWithCounter: {
    id: `dashboard.EditExpenditureDialog.ChangedMultiple.ChangeHeader.changeWithCounter`,
    defaultMessage: '{count}: {changeType}',
  },
});

const displayName = `dashboard.EditExpenditureDialog.ChangeHeader`;

interface Props {
  name?: string;
  count?: number;
  withCounter?: boolean;
}

const ChangeHeader = ({ name, count, withCounter }: Props) => {
  if (!name) {
    return null;
  }

  return (
    <div className={styles.header}>
      {withCounter ? (
        <FormattedMessage
          {...MSG.changeWithCounter}
          values={{
            count,
            changeType: capitalize(name),
          }}
        />
      ) : (
        <FormattedMessage
          {...MSG.change}
          values={{
            name: capitalize(name),
          }}
        />
      )}
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.subheader}>
          <span>
            <FormattedMessage {...MSG.from} />
          </span>
          <span>
            <FormattedMessage {...MSG.to} />
          </span>
        </div>
      </FormSection>
    </div>
  );
};

ChangeHeader.displayName = displayName;

export default ChangeHeader;
