import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { Colony, LoggedInUser } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';
import { Staged } from '~dashboard/ExpenditurePage/Staged/types';
import { Batch } from '~dashboard/ExpenditurePage/Batch/types';
import { FormSection } from '~core/Fields';

import ChangeItem from '../ChangedMultiple/ChangeItem';

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

export type NewValueType = {
  id: string;
  key: string;
  value?:
    | ValuesType['recipients']
    | string
    | Staged
    | Pick<
        LoggedInUser,
        'walletAddress' | 'balance' | 'username' | 'ethereal' | 'networkId'
      >
    | Batch;
};

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
  return (
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
      {typeof newValues?.value === 'object' &&
        Object.entries(newValues.value).map(([key, value]) => {
          const oldValue = oldValues[newValues.key]?.[key];

          if (skip.includes(key)) {
            return null;
          }

          return (
            <>
              <ChangeItem
                newValue={value}
                oldValue={oldValue}
                key={value.id}
                colony={colony}
                name={key}
              />
            </>
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
