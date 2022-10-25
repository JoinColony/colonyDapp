import { FieldArray } from 'formik';
import React, { Fragment } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Button from '~core/Button';
import { Colony, LoggedInUser } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';
import { Staged } from '~dashboard/ExpenditurePage/Staged/types';
import { Batch } from '~dashboard/ExpenditurePage/Batch/types';

import ChangeHeader from '../ChangeHeader';
import ChangedRecipient from '../ChangedSplit/ChangedRecipient';

import styles from './ChangedAdvanced.css';

export const MSG = defineMessages({
  discard: {
    id: 'dashboard.EditExpenditureDialog.ChangedAdvanced.discard',
    defaultMessage: 'Discard',
  },
  changeRecipient: {
    id: 'dashboard.EditExpenditureDialog.ChangedAdvanced.changeRecipient',
    defaultMessage: 'Change Recipient',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.ChangedAdvanced';

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
  newValues?: NewValueType[];
  colony: Colony;
  oldValues: ValuesType;
}

const ChangedAdvanced = ({ newValues, oldValues, colony }: Props) => {
  const { formatMessage } = useIntl();

  if (!Array.isArray(newValues) || !Array.isArray) {
    return null;
  }

  return (
    <>
      {newValues?.map((newValue) => (
        <Fragment key={newValue.id}>
          {Array.isArray(newValue.value) &&
            newValue.value?.map((changeItem, index) => {
              const oldItem = oldValues[newValue.key]?.find(
                (item) => item?.id === changeItem?.id,
              );
              return (
                <Fragment key={changeItem.id || index}>
                  <FieldArray
                    name={newValue?.key || 'change'}
                    render={({ remove }) => (
                      <>
                        <ChangeHeader
                          name={formatMessage(MSG.changeRecipient)}
                          count={index + 1}
                          withCounter
                        />
                        <ChangedRecipient
                          recipient={changeItem}
                          oldRecipient={oldItem}
                          colony={colony}
                        />
                        <div className={styles.buttonWrappper}>
                          <Button
                            className={styles.discard}
                            onClick={() => {
                              remove(index);
                            }}
                            text={MSG.discard}
                          />
                        </div>
                      </>
                    )}
                  />
                </Fragment>
              );
            })}
        </Fragment>
      ))}
    </>
  );
};

ChangedAdvanced.displayName = displayName;

export default ChangedAdvanced;
