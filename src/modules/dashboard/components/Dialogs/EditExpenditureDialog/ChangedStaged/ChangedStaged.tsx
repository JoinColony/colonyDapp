import React, { Fragment } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { isEmpty } from 'lodash';

import Button from '~core/Button';
import { Batch } from '~dashboard/ExpenditurePage/Batch/types';
import { Staged } from '~dashboard/ExpenditurePage/Staged/types';
import { Colony, LoggedInUser } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';

import ChangeHeader from '../ChangeHeader';
import ChangeItem from '../ChangedMultiple/ChangeItem';

import { isMilestoneType } from './utils';
import ChangedMilestone from './ChangedMilestone';
import styles from './ChangedStaged.css';

export const MSG = defineMessages({
  discard: {
    id: 'dashboard.EditExpenditureDialog.ChangedStaged.discard',
    defaultMessage: 'Discard',
  },
  milestone: {
    id: 'dashboard.EditExpenditureDialog.ChangedStaged.milestone',
    defaultMessage: 'Change Milestone',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.ChangedStaged';
export const skip = ['id', 'isExpanded', 'created', 'released', 'percent'];

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

  if (typeof newValues.value !== 'object') {
    return null;
  }

  const changedStaged = Object.entries(newValues.value).filter(
    ([key, value]) => {
      return !(skip.includes(key) || Array.isArray(value));
    },
  );

  const changedMilestones = Object.entries(newValues.value).filter(
    ([key, value]) => {
      return !skip.includes(key) && Array.isArray(value);
    },
  );

  return (
    <>
      {!isEmpty(changedStaged) && (
        <>
          <ChangeHeader name={newValues.key} />
          {changedStaged.map(([key, value]) => {
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
        </>
      )}
      {changedMilestones.map(([key, milestones]) => {
        const oldValue = oldValues[newValues?.key || 'staged']?.[key];

        return (
          <>
            {milestones.map((milestone, idx) => {
              if (!isMilestoneType(milestone)) {
                return null;
              }
              const oldMilestone = oldValue.find(
                (milestoneItem) => milestoneItem.id === milestone.id,
              );

              return (
                <Fragment key={milestone.id}>
                  <ChangeHeader
                    name={formatMessage(MSG.milestone)}
                    count={idx + 1}
                    withCounter
                  />
                  <ChangedMilestone
                    milestone={milestone}
                    oldMilestone={oldMilestone}
                    colony={colony}
                  />
                </Fragment>
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
