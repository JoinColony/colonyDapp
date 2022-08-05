import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { FormSection } from '~core/Fields';
import Numeral from '~core/Numeral';
import UserMention from '~core/UserMention';
import { Recipient as RecipientType } from '~dashboard/ExpenditurePage/Payments/types';
import { getRecipientTokens } from '~dashboard/ExpenditurePage/utils';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/ExpenditurePage';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import NewDelay from '../NewDelay';
import NewRecipient from '../NewRecipient';
import NewValue from '../NewValue';

import styles from './Recipient.css';

export const MSG = defineMessages({
  newRecipient: {
    id: 'dashboard.EditExpenditureDialog.Recipient.newRecipient',
    defaultMessage: 'New recipient',
  },
  new: {
    id: 'dashboard.EditExpenditureDialog.Recipient.new',
    defaultMessage: 'New',
  },
  discard: {
    id: 'dashboard.EditExpenditureDialog.Recipient.discard',
    defaultMessage: 'Discard',
  },
  removed: {
    id: 'dashboard.EditExpenditureDialog.Recipient.removed',
    defaultMessage: 'Recipient has been deleted',
  },
  removedDelay: {
    id: 'dashboard.EditExpenditureDialog.Recipient.removedDelay',
    defaultMessage: 'Removed claim delay',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.Recipient';

interface Props {
  discardRecipientChange: (id: string) => void;
  oldValues: ValuesType;
  changedItem: RecipientType;
  index: number;
  colony: Colony;
}

const Recipient = ({
  discardRecipientChange,
  oldValues,
  changedItem,
  index,
  colony,
}: Props) => {
  const oldValue: RecipientType | undefined = oldValues.recipients.find(
    (recipient) => recipient?.id === changedItem?.id,
  );
  const recipientValues = oldValue && getRecipientTokens(oldValue, colony);

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
            return <NewDelay newValue={newValue} />;
          }
          default:
            return null;
        }
      });
    },
    [colony],
  );

  return (
    <>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.reicpientButtonContainer}>
          <div className={styles.recipientContainer}>
            {index + 1}:{' '}
            {!oldValue ? (
              <FormattedMessage {...MSG.newRecipient} />
            ) : (
              <>
                <UserMention
                  username={
                    oldValue.recipient?.profile.username ||
                    oldValue.recipient?.profile.displayName ||
                    ''
                  }
                />
                {', '}
                {recipientValues?.map(
                  ({ amount, token }, idx) =>
                    token &&
                    amount && (
                      <div className={styles.valueAmount} key={idx}>
                        <span className={styles.icon}>
                          <TokenIcon
                            className={styles.tokenIcon}
                            token={token}
                            name={token.name || token.address}
                          />
                        </span>
                        <Numeral
                          // eslint-disable-next-line max-len
                          unit={getTokenDecimalsWithFallback(0)}
                          value={amount}
                        />
                        <span className={styles.symbol}>{token.symbol}</span>
                      </div>
                    ),
                )}
                {oldValue?.delay?.amount && (
                  <>
                    {', '}
                    {oldValue.delay?.amount}
                    {oldValue.delay?.time}
                  </>
                )}
              </>
            )}
          </div>
          <Button
            appearance={{ theme: 'dangerLink' }}
            onClick={() => discardRecipientChange(changedItem?.id || '')}
          >
            <FormattedMessage {...MSG.discard} />
          </Button>
        </div>
      </FormSection>
      {renderRecipientChange(changedItem)}
    </>
  );
};

Recipient.displayName = displayName;

export default Recipient;
