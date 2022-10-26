import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import { nanoid } from 'nanoid';

import Button from '~core/Button';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';
import { FormSection } from '~core/Fields';

import ChangeItem from '../ChangeItem';
import { NewValueType } from '../types';

import styles from './ChangedBatch.css';

export const MSG = defineMessages({
  discard: {
    id: 'dashboard.EditExpenditureDialog.ChangedBatch.discard',
    defaultMessage: 'Discard',
  },
  change: {
    id: 'dashboard.EditExpenditureDialog.ChangedBatch.change',
    defaultMessage: 'Change Batch',
  },
  from: {
    id: 'dashboard.EditExpenditureDialog.ChangedBatch.from',
    defaultMessage: 'From',
  },
  changeTo: {
    id: 'dashboard.EditExpenditureDialog.ChangedBatch.changeTo',
    defaultMessage: 'Change to',
  },
  removed: {
    id: 'dashboard.EditExpenditureDialog.ChangedBatch.removed',
    defaultMessage: 'Recipient has been deleted',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.ChangedBatch';
const skip = ['id', 'dataCSVUploader', 'data'];

interface Props {
  newValues?: NewValueType;
  colony: Colony;
  oldValues: ValuesType;
  discardChange: (name: string) => void;
}

const ChangedBatch = ({
  newValues,
  oldValues,
  colony,
  discardChange,
}: Props) => {
  const batchChanges = useMemo(
    () =>
      typeof newValues?.value === 'object'
        ? Object.entries(newValues.value)
            .filter(([key]) => !skip.includes(key))
            .map(([key, value]) => ({ key, value, id: nanoid() }))
        : [],
    [newValues],
  );

  if (!newValues) {
    return null;
  }

  return (
    <>
      {!isEmpty(batchChanges) && (
        <>
          <div className={styles.changeContainer}>
            <FormattedMessage {...MSG.change} />
          </div>
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
        </>
      )}
      {batchChanges.map(({ key, value, id }) => {
        const oldValue = oldValues[newValues.key]?.[key];

        return (
          <ChangeItem
            newValue={value}
            oldValue={oldValue}
            key={id}
            colony={colony}
            name={key}
          />
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

ChangedBatch.displayName = displayName;

export default ChangedBatch;
