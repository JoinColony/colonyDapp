import React, { Fragment, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { nanoid } from 'nanoid';
import Button from '~core/Button';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';

import ChangeItem from '../ChangeItem';
import ChangeHeader from '../ChangeHeader';
import { NewValueType } from '../types';

import { isRecipientType } from './utils';
import ChangedRecipient from './ChangedRecipient';
import styles from './ChangedSplit.css';

export const MSG = defineMessages({
  discard: {
    id: 'dashboard.EditExpenditureDialog.ChangedSplit.discard',
    defaultMessage: 'Discard',
  },
  change: {
    id: 'dashboard.EditExpenditureDialog.ChangedSplit.change',
    defaultMessage: 'Amount',
  },
  removed: {
    id: 'dashboard.EditExpenditureDialog.ChangedSplit.removed',
    defaultMessage: 'Recipient has been deleted',
  },
  changeRecipient: {
    id: 'dashboard.EditExpenditureDialog.ChangedSplit.changeRecipient',
    defaultMessage: 'Change Recipient',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.ChangedSplit';
export const skip = [
  'id',
  'claimDate',
  'isExpanded',
  'created',
  'percent',
  'unequal',
];

interface Props {
  newValues?: NewValueType;
  colony: Colony;
  oldValues: ValuesType;
  discardChange: (name: string) => void;
}

const ChangedSplit = ({
  newValues,
  oldValues,
  colony,
  discardChange,
}: Props) => {
  const { formatMessage } = useIntl();

  const changedSplit = useMemo(
    () =>
      typeof newValues?.value === 'object'
        ? Object.entries(newValues.value)
            .map(([key, value]) => ({ key, value, id: nanoid() }))
            .filter(({ key, value }) => {
              return !(skip.includes(key) || Array.isArray(value));
            })
        : [],
    [newValues],
  );

  const changedRecipients = useMemo(
    () =>
      typeof newValues?.value === 'object'
        ? Object.entries(newValues.value).filter(
            ([key, value]) => !skip.includes(key) && Array.isArray(value),
          )
        : [],
    [newValues],
  );

  if (!newValues) {
    return null;
  }

  return (
    <>
      {changedSplit.map(({ key, value, id }) => {
        const oldValue = oldValues[newValues.key]?.[key];

        return (
          <Fragment key={id}>
            <ChangeHeader name={formatMessage(MSG.change)} />
            <ChangeItem
              newValue={value}
              oldValue={oldValue}
              colony={colony}
              name={key}
            />
          </Fragment>
        );
      })}

      {changedRecipients.map(([key, value]) => {
        const oldRecipients = oldValues[newValues.key]?.[key];

        return (
          <Fragment key={key}>
            {value.map((recipient, idx) => {
              if (!isRecipientType(recipient)) {
                return null;
              }
              const oldRecipienet = oldRecipients.find(
                (rec) => rec.id === recipient.id,
              );

              return (
                <Fragment key={recipient.id}>
                  <ChangeHeader
                    name={formatMessage(MSG.changeRecipient)}
                    count={idx + 1}
                    withCounter
                  />
                  <ChangedRecipient
                    recipient={recipient}
                    oldRecipient={oldRecipienet}
                    colony={colony}
                  />
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
      <div className={styles.buttonWrappper}>
        <Button
          className={styles.discard}
          onClick={() => discardChange(newValues?.key || '')}
          text={MSG.discard}
        />
      </div>
    </>
  );
};

ChangedSplit.displayName = displayName;

export default ChangedSplit;