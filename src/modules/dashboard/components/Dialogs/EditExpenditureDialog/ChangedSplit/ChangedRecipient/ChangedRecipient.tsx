import { isNil } from 'lodash';
import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import { Recipient } from '~dashboard/ExpenditurePage/Split/types';
import { AnyUser, Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';

import ChangeItem from '../../ChangeItem';
import { ValueOf } from '../../ChangedValues/ChangedValues';
import { skip } from '../ChangedSplit';

import styles from './ChangedRecipient.css';

export const MSG = defineMessages({
  removed: {
    id: `dashboard.EditExpenditureDialog.ChangedSplit.ChangedRecipient.removed`,
    defaultMessage: 'Recipient has been deleted',
  },
});

const displayName = `dashboard.EditExpenditureDialog.ChangedSplit.ChangedRecipient`;

interface Props {
  recipient: Partial<AnyUser>;
  oldRecipient: Recipient;
  colony: Colony;
}

const ChangedRecipient = ({ recipient, oldRecipient, colony }: Props) => {
  const recipientArray = useMemo(
    () =>
      Object.entries(recipient).map(([key, value]) => ({
        key,
        value,
        id: nanoid(),
      })),
    [recipient],
  );

  return (
    <>
      {recipientArray.map(({ key, value, id }) => {
        // key - 'user', 'amount', 'id', 'removed'
        if (skip.includes(key)) {
          return null;
        }

        if (key === 'amount' && isNil(value)) {
          return null;
        }

        if (key === 'removed') {
          const keyName = 'recipient' in oldRecipient ? 'recipient' : 'user';
          const username =
            oldRecipient[keyName].profile.username ||
            oldRecipient[keyName].profile.displayName;

          return (
            <div className={styles.row} key={id}>
              {username}
              <Icon name="arrow-right" className={styles.arrowIcon} />
              <span className={styles.right}>
                <FormattedMessage {...MSG.removed} />
              </span>
            </div>
          );
        }

        return (
          <ChangeItem
            newValue={value as ValueOf<ValuesType>}
            oldValue={oldRecipient?.[key]}
            key={id}
            colony={colony}
            name={key}
          />
        );
      })}
    </>
  );
};

ChangedRecipient.displayName = displayName;

export default ChangedRecipient;
