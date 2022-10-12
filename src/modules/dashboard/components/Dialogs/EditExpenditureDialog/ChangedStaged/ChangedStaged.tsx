import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { isEmpty } from 'lodash';

import Button from '~core/Button';
import { FormSection } from '~core/Fields';
import Icon from '~core/Icon';
import { Batch } from '~dashboard/ExpenditurePage/Batch/types';
import { Staged } from '~dashboard/ExpenditurePage/Staged/types';
import { Colony, LoggedInUser } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';
import { capitalize } from '~utils/strings';

import ChangeHeader from '../ChangedMultiple/ChangeHeader';
import ChangeItem from '../ChangedMultiple/ChangeItem';

import { isMilestoneType } from './utils';
import styles from './ChangedStaged.css';

export const MSG = defineMessages({
  discard: {
    id: 'dashboard.EditExpenditureDialog.ChangedStaged.discard',
    defaultMessage: 'Discard',
  },
  change: {
    id: 'dashboard.EditExpenditureDialog.ChangedStaged.change',
    defaultMessage: 'Change Staged',
  },
  from: {
    id: 'dashboard.EditExpenditureDialog.ChangedStaged.from',
    defaultMessage: 'From',
  },
  to: {
    id: 'dashboard.EditExpenditureDialog.ChangedStaged.to',
    defaultMessage: 'To',
  },
  removed: {
    id: 'dashboard.EditExpenditureDialog.ChangedStaged.removed',
    defaultMessage: 'Mielstone has been deleted',
  },
  milestone: {
    id: 'dashboard.EditExpenditureDialog.ChangedStaged.milestone',
    defaultMessage: 'Change Mielstone',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.ChangedStaged';
const skip = ['id', 'isExpanded', 'created', 'released', 'percent'];

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

const ChangedStaged = ({
  newValues,
  oldValues,
  colony,
  discardChange,
}: Props) => {
  const { formatMessage } = useIntl();
  if (!newValues) {
    return null;
  }

  const stagedChanges =
    typeof newValues?.value === 'object'
      ? Object.entries(newValues.value).filter(([key, value]) => {
          return !(skip.includes(key) || Array.isArray(value));
        })
      : [];

  return (
    <>
      {!isEmpty(stagedChanges) && (
        <FormSection appearance={{ border: 'bottom' }}>
          <div className={styles.changeContainer}>
            <FormattedMessage {...MSG.change} />
          </div>
          <div className={styles.subheader}>
            <span>
              <FormattedMessage {...MSG.from} />
            </span>
            <span>
              <FormattedMessage {...MSG.to} />
            </span>
          </div>
        </FormSection>
      )}
      {stagedChanges.map(([key, value]) => {
        const oldValue = oldValues[newValues?.key || 'staged']?.[key];

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
      {typeof newValues?.value === 'object' &&
        Object.entries(newValues.value)
          .filter(([key, value]) => {
            return !skip.includes(key) && Array.isArray(value);
          })
          .map(([key, value]) => {
            const oldValue = oldValues[newValues?.key || 'staged']?.[key];

            return (
              <>
                {value.map((changeItem, idx) => {
                  // changeItem is staged.milestones
                  if (!isMilestoneType(changeItem)) {
                    return null;
                  }
                  const oldMilestone = oldValue.find(
                    (milestone) => milestone.id === changeItem.id,
                  );

                  const name =
                    key === 'milestones'
                      ? formatMessage(MSG.milestone)
                      : capitalize(key);

                  return (
                    <>
                      <ChangeHeader name={name} index={idx} />
                      {Object.entries(changeItem).map(
                        ([recipientKey, recipientValue], index) => {
                          // recipientKey - 'user', 'amount', 'id'
                          if (skip.includes(recipientKey)) {
                            return null;
                          }

                          if (recipientKey === 'removed') {
                            return (
                              <div className={styles.row}>
                                {oldMilestone.name}
                                <Icon
                                  name="arrow-right"
                                  className={styles.arrowIcon}
                                />
                                <span className={styles.right}>
                                  <FormattedMessage {...MSG.removed} />
                                </span>
                              </div>
                            );
                          }

                          return (
                            <ChangeItem
                              newValue={recipientValue}
                              oldValue={oldMilestone?.[recipientKey]}
                              key={recipientValue.id || index}
                              colony={colony}
                              name={recipientKey}
                            />
                          );
                        },
                      )}
                    </>
                  );
                })}
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

ChangedStaged.displayName = displayName;

export default ChangedStaged;
