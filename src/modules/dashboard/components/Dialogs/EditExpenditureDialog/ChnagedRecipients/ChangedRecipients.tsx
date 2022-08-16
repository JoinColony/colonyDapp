import { FieldArray } from 'formik';
import { isEmpty, isNil } from 'lodash';
import React, { useCallback, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Button from '~core/Button';
import { FormSection } from '~core/Fields';
import Numeral from '~core/Numeral';
import UserMention from '~core/UserMention';
import { Recipient as RecipientType } from '~dashboard/ExpenditurePage/Payments/types';
import { getRecipientTokens } from '~dashboard/ExpenditurePage/utils';
import { Colony, LoggedInUser } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';
import NewDelay from '../NewDelay';
import NewRecipient from '../NewRecipient';
import NewValue from '../NewValue';

import styles from './ChangedRecipients.css';

export const MSG = defineMessages({
  newRecipient: {
    id: 'dashboard.EditExpenditureDialog.ChangedRecipients.newRecipient',
    defaultMessage: '{count}: New recipient',
  },
  new: {
    id: 'dashboard.EditExpenditureDialog.ChangedRecipients.new',
    defaultMessage: 'New',
  },
  discard: {
    id: 'dashboard.EditExpenditureDialog.ChangedRecipients.discard',
    defaultMessage: 'Discard',
  },
  removed: {
    id: 'dashboard.EditExpenditureDialog.ChangedRecipients.removed',
    defaultMessage: 'Recipient has been deleted',
  },
  removedDelay: {
    id: 'dashboard.EditExpenditureDialog.ChangedRecipients.removedDelay',
    defaultMessage: 'Removed claim delay',
  },
  userHeader: {
    id: 'dashboard.EditExpenditureDialog.ChangedRecipients.userHeader',
    defaultMessage: `{count}: {name}, {value}`,
  },
  delay: {
    id: 'dashboard.EditExpenditureDialog.ChangedRecipients.delay',
    defaultMessage: `, {amount} {time}`,
  },
  noChanges: {
    id: 'dashboard.EditExpenditureDialog.ChangedRecipients.noChanges',
    defaultMessage: 'No values have been changed!',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.ChangedRecipients';

interface Props {
  newRecipients?:
    | string
    | Pick<
        LoggedInUser,
        'walletAddress' | 'balance' | 'username' | 'ethereal' | 'networkId'
      >
    | Partial<RecipientType>[];
  colony: Colony;
  oldValues: ValuesType;
}

const ChangedRecipients = ({ newRecipients, colony, oldValues }: Props) => {
  const renderRecipientChange = useCallback(
    (changedRecipient: RecipientType) => {
      if (!changedRecipient) {
        return null;
      }

      if (changedRecipient.removed) {
        return (
          <div className={styles.row}>
            <FormattedMessage {...MSG.removed} />
          </div>
        );
      }

      return Object.entries(changedRecipient).map(([type, newValue]) => {
        switch (type) {
          case 'recipient': {
            return <NewRecipient newValue={newValue} />;
          }
          case 'value': {
            return (
              <NewValue colony={colony} changedRecipient={changedRecipient} />
            );
          }
          case 'delay': {
            if (changedRecipient.created && isNil(newValue.amount)) {
              return null;
            }
            return <NewDelay newValue={newValue} />;
          }
          default:
            return null;
        }
      });
    },
    [colony],
  );

  if (
    !newRecipients ||
    !Array.isArray(newRecipients) ||
    isEmpty(newRecipients)
  ) {
    return null;
  }

  return (
    <FieldArray
      name="recipients"
      render={({ remove }) => (
        <>
          {newRecipients.map((changedItem, index) => {
            const oldValue:
              | RecipientType
              | undefined = oldValues.recipients.find(
              (recipient) => recipient?.id === changedItem?.id,
            );
            const recipientValues =
              oldValue && getRecipientTokens(oldValue, colony);

            return (
              <Fragment key={changedItem.key}>
                <FormSection appearance={{ border: 'bottom' }}>
                  <div className={styles.reicpientButtonContainer}>
                    <div className={styles.recipientContainer}>
                      {!oldValue ? (
                        <FormattedMessage
                          {...MSG.newRecipient}
                          values={{
                            count: index + 1,
                          }}
                        />
                      ) : (
                        <div className={styles.name}>
                          <FormattedMessage
                            {...MSG.userHeader}
                            values={{
                              count: index + 1,
                              name: (
                                <UserMention
                                  username={
                                    oldValue.recipient?.profile.username ||
                                    oldValue.recipient?.profile.displayName ||
                                    ''
                                  }
                                />
                              ),
                              value: recipientValues?.map(
                                ({ amount, token }, idx) =>
                                  token &&
                                  amount && (
                                    <div className={styles.value} key={idx}>
                                      <Numeral value={amount} />
                                      {token.symbol}
                                    </div>
                                  ),
                              ),
                            }}
                          />
                          {changedItem.delay?.amount && (
                            <FormattedMessage
                              {...MSG.delay}
                              values={{
                                amount: changedItem.delay.amount,
                                time: changedItem.delay.time,
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      className={styles.discard}
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <FormattedMessage {...MSG.discard} />
                    </Button>
                  </div>
                </FormSection>
                {renderRecipientChange(changedItem)}
              </Fragment>
            );
          })}
        </>
      )}
    />
  );
};

ChangedRecipients.displayName = displayName;

export default ChangedRecipients;
