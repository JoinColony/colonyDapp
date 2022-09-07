import { FieldArray } from 'formik';
import { isNil } from 'lodash';
import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import Button from '~core/Button';
import { FormSection } from '~core/Fields';
import { Colony, LoggedInUser } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';
import { Staged } from '~dashboard/ExpenditurePage/Staged/types';

import ChangeItem from './ChangeItem';
import styles from './ChangedMultiple.css';

export const MSG = defineMessages({
  newChange: {
    id: 'dashboard.EditExpenditureDialog.ChangedMultiple.newChange',
    defaultMessage: '{count}: {changeType}',
  },
  discard: {
    id: 'dashboard.EditExpenditureDialog.ChangedMultiple.discard',
    defaultMessage: 'Discard',
  },
  from: {
    id: 'dashboard.EditExpenditureDialog.ChangedMultiple.from',
    defaultMessage: 'From',
  },
  changeTo: {
    id: 'dashboard.EditExpenditureDialog.ChangedMultiple.changeTo',
    defaultMessage: 'Change to',
  },
  recipient: {
    id: 'dashboard.EditExpenditureDialog.ChangedMultiple.recipient',
    defaultMessage: 'Recipient',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.ChangedMultiple';
const skip = ['id', 'claimDate', 'isExpanded', 'created', 'removed'];

type NewValuesType = {
  id: string;
  key: string;
  value?:
    | ValuesType['recipients']
    | string
    | Staged
    | Pick<
        LoggedInUser,
        'walletAddress' | 'balance' | 'username' | 'ethereal' | 'networkId'
      >;
}[];

interface Props {
  newValues?: NewValuesType;
  colony: Colony;
  oldValues: ValuesType;
}

const ChangedMultiple = ({ newValues, oldValues, colony }: Props) => {
  const { formatMessage } = useIntl();

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
                <FieldArray
                  name={newValue?.key || 'change'}
                  render={({ remove }) => (
                    <>
                      <div className={styles.header}>
                        <FormattedMessage
                          {...MSG.newChange}
                          values={{
                            count: index + 1,
                            changeType:
                              newValue.key === 'recipients'
                                ? formatMessage(MSG.recipient)
                                : newValue.key,
                          }}
                        />
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
                      </div>
                      {Object.entries(changeItem)?.map(([key, value]) => {
                        if (skip.includes(key)) {
                          return null;
                        }
                        if (
                          key === 'delay' &&
                          changeItem.created &&
                          isNil(value.amount)
                        ) {
                          return null;
                        }

                        const oldValue = oldItem?.[key];

                        return (
                          <ChangeItem
                            newValue={value}
                            oldValue={oldValue}
                            key={key}
                            colony={colony}
                            name={key}
                          />
                        );
                      })}
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
              );
            })}
        </Fragment>
      ))}
    </>
  );
};

ChangedMultiple.displayName = displayName;

export default ChangedMultiple;
