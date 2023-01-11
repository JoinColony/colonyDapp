import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';

import styles from './NewDelay.css';

export const MSG = defineMessages({
  newClaimDelay: {
    id: 'dashboard.EditExpenditureDialog.NewDelay.newClaimDelay',
    defaultMessage: 'New claim delay',
  },
  none: {
    id: 'dashboard.EditExpenditureDialog.NewDelay.none',
    defaultMessage: 'None',
  },
  delay: {
    id: 'dashboard.EditExpenditureDialog.NewDelay.delay',
    defaultMessage: '{amount} {time}',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.NewDelay';

interface Props {
  newValue: Recipient['delay'];
}

const NewDelay = ({ newValue }: Props) => {
  return (
    <div className={styles.row}>
      <div className={styles.value}>
        {!newValue?.amount ? (
          <FormattedMessage {...MSG.none} />
        ) : (
          <FormattedMessage
            {...MSG.delay}
            values={{ amount: newValue?.amount, time: newValue?.time }}
          />
        )}
      </div>
    </div>
  );
};

NewDelay.displayName = displayName;

export default NewDelay;
