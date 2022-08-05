import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection } from '~core/Fields';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';

import styles from './NewDelay.css';

export const MSG = defineMessages({
  newClaimDelay: {
    id: 'dashboard.EditExpenditureDialog.NewDelay.newClaimDelay',
    defaultMessage: 'New claim delay',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.NewDelay';

interface Props {
  newValue: Recipient['delay'];
}

const NewDelay = ({ newValue }: Props) => {
  return (
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={styles.row}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.newClaimDelay} />
        </span>
        <div className={styles.value}>
          {!newValue?.amount ? (
            '-'
          ) : (
            <>
              {newValue?.amount} {newValue?.time}
            </>
          )}
        </div>
      </div>
    </FormSection>
  );
};

NewDelay.displayName = displayName;

export default NewDelay;
