import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import { Milestone } from '~dashboard/ExpenditurePage/Staged/types';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';

import ChangeItem from '../../ChangedMultiple/ChangeItem';
import { ValueOf } from '../../ChangedValues/ChangedValues';

import { skip } from '../ChangedStaged';

import styles from './ChangedMilestone.css';

export const MSG = defineMessages({
  removed: {
    id: `dashboard.EditExpenditureDialog.ChangedStaged.ChangedMilestone.removed`,
    defaultMessage: 'Milestone has been deleted',
  },
});

const displayName = `dashboard.EditExpenditureDialog.ChangedStaged.ChangedMilestone`;

interface Props {
  milestone: Partial<Milestone>;
  oldMilestone: Milestone;
  colony: Colony;
}

const ChangedMilestone = ({ milestone, oldMilestone, colony }: Props) => {
  const milestoneArray = useMemo(
    () =>
      Object.entries(milestone).map(([key, value]) => ({
        key,
        value,
        id: nanoid(),
      })),
    [milestone],
  );

  return (
    <>
      {milestoneArray.map(({ key, value, id }) => {
        // key - 'user', 'amount', 'id', 'removed'
        if (skip.includes(key)) {
          return null;
        }

        if (key === 'removed') {
          return (
            <div className={styles.row} key={id}>
              {oldMilestone.name}
              <Icon name="arrow-right" className={styles.arrowIcon} />
              <span className={styles.right}>
                <FormattedMessage {...MSG.removed} />
              </span>
            </div>
          );
        }

        return (
          <ChangeItem
            newValue={value as ValueOf<ValuesType>}
            oldValue={oldMilestone?.[key]}
            key={id}
            colony={colony}
            name={key}
          />
        );
      })}
    </>
  );
};

ChangedMilestone.displayName = displayName;

export default ChangedMilestone;
