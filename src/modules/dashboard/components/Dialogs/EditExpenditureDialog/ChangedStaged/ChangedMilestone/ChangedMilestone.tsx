import React from 'react';
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
    defaultMessage: 'Mielstone has been deleted',
  },
});

const displayName = `dashboard.EditExpenditureDialog.ChangedStaged.ChangedMilestone`;

interface Props {
  milestone: Partial<Milestone>;
  oldMilestone: Milestone;
  colony: Colony;
}

const ChangedMilestone = ({ milestone, oldMilestone, colony }: Props) => {
  return (
    <>
      {Object.entries(milestone).map(
        ([milestoneKey, milestoneValue], index) => {
          // milestoneKey - 'user', 'amount', 'id', 'removed'
          if (skip.includes(milestoneKey)) {
            return null;
          }

          if (milestoneKey === 'removed') {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <div className={styles.row} key={index}>
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
              newValue={milestoneValue as ValueOf<ValuesType>}
              oldValue={oldMilestone?.[milestoneKey]}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              colony={colony}
              name={milestoneKey}
            />
          );
        },
      )}
    </>
  );
};

ChangedMilestone.displayName = displayName;

export default ChangedMilestone;
