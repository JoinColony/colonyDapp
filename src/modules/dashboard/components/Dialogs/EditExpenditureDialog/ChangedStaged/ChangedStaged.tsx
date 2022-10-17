import React, { Fragment, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { nanoid } from 'nanoid';

import Button from '~core/Button';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';
import { capitalize } from '~utils/strings';

import ChangeHeader from '../ChangeHeader';
import ChangeItem from '../ChangedMultiple/ChangeItem';
import { NewValueType } from '../types';

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
  changeHeader: {
    id: 'dashboard.EditExpenditureDialog.ChangedStaged.changeHeader',
    defaultMessage: 'Staged {name}',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.ChangedStaged';
export const skip = ['id', 'isExpanded', 'created', 'released', 'percent'];

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

  const changed = useMemo(() => {
    if (typeof newValues?.value !== 'object') {
      return undefined;
    }
    const staged = Object.entries(newValues.value)
      .map(([key, value]) => ({ key, value, id: nanoid() }))
      .filter(({ key, value }) => {
        return !(skip.includes(key) || Array.isArray(value));
      });

    const milestones = Object.entries(newValues.value).filter(
      ([key, value]) => {
        return !skip.includes(key) && Array.isArray(value);
      },
    );

    return {
      staged,
      milestones,
    };
  }, [newValues]);

  if (!newValues || !changed) {
    return null;
  }

  return (
    <>
      {changed.staged.map(({ key, value, id }) => {
        const oldValue = oldValues[newValues?.key || 'staged']?.[key];

        return (
          <Fragment key={id}>
            <ChangeHeader
              name={formatMessage(MSG.changeHeader, {
                name: capitalize(key),
              })}
            />
            <ChangeItem
              newValue={value}
              oldValue={oldValue}
              key={value.id}
              colony={colony}
              name={key}
            />
          </Fragment>
        );
      })}
      {changed.milestones.map(([key, milestones]) => {
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
