import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import { Recipient } from '~dashboard/ExpenditurePage/Split/types';
import { AnyUser, Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';

import ChangeItem from '../../ChangedMultiple/ChangeItem';
import { ValueOf } from '../../ChangedValues/ChangedValues';

import { skip } from '../ChangedSplit';

import styles from './ChangedRecipient.css';

export const MSG = defineMessages({
  removed: {
    id: `dashboard.EditExpenditureDialog.ChangedStaged.ChangedRecipient.removed`,
    defaultMessage: 'Mielstone has been deleted',
  },
});

const displayName = `dashboard.EditExpenditureDialog.ChangedStaged.ChangedRecipient`;

interface Props {
  recipient: Partial<AnyUser>;
  oldRecipient: Recipient;
  colony: Colony;
}

const ChangedRecipient = ({ recipient, oldRecipient, colony }: Props) => {
  return (
    <>
      {Object.entries(recipient).map(
        ([recipientKey, recipientValue], index) => {
          // milestoneKey - 'user', 'amount', 'id', 'removed'
          if (skip.includes(recipientKey)) {
            return null;
          }

          if (recipientKey === 'removed') {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <div className={styles.row} key={index}>
                {oldRecipient.user?.profile.username}
                <Icon name="arrow-right" className={styles.arrowIcon} />
                <span className={styles.right}>
                  <FormattedMessage {...MSG.removed} />
                </span>
              </div>
            );
          }

          return (
            <ChangeItem
              newValue={recipientValue as ValueOf<ValuesType>}
              oldValue={oldRecipient?.[recipientKey]}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              colony={colony}
              name={recipientKey}
            />
          );
        },
      )}
    </>
  );
};

ChangedRecipient.displayName = displayName;

export default ChangedRecipient;
