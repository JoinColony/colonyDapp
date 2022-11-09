import { isEmpty } from 'lodash';
import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import { FundingSource } from '~dashboard/ExpenditurePage/Streaming/types';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';

import { ValueOf } from '../../ChangedValues/ChangedValues';
import ChangeItem from '../../ChangeItem';
import NewRate from '../../NewRate';

import ChangeRate from '../ChangedRate/ChangeRate';
import { skip } from '../ChangedStreaming';
import NewTeam from '../NewTeam';

import styles from './ChangedFundingSource.css';

export const MSG = defineMessages({
  removed: {
    id: `dashboard.EditExpenditureDialog.ChangedStreaming.ChangedFundingSource.removed`,
    defaultMessage: 'Funding Source has been deleted',
  },
  removedRate: {
    id: `dashboard.EditExpenditureDialog.ChangedStreaming.ChangedFundingSource.removedRate`,
    defaultMessage: 'Rate has been deleted',
  },
  none: {
    id: `dashboard.EditExpenditureDialog.ChangedStreaming.ChangedFundingSource.none`,
    defaultMessage: 'None',
  },
});

const displayName = `dashboard.EditExpenditureDialog.ChangedStreaming.ChangedFundingSource`;

interface Props {
  fundingSource: Partial<FundingSource> & { removed?: boolean };
  oldFundingSource?: FundingSource;
  colony: Colony;
}

const ChangedFundingSource = ({
  fundingSource,
  oldFundingSource,
  colony,
}: Props) => {
  const fundingSourceArray = useMemo(
    () =>
      Object.entries(fundingSource).map(([key, value]) => ({
        key,
        value,
        id: nanoid(),
      })),
    [fundingSource],
  );

  // we have to find rates that have been removed
  const removedRates = fundingSource?.removed
    ? undefined
    : oldFundingSource?.rates.filter(
        (oldItem) =>
          !fundingSource?.rates?.find((rate) => rate.id === oldItem.id),
      );

  return (
    <>
      {fundingSourceArray.map(({ key, value, id }) => {
        // key - 'user', 'amount', 'id', 'removed'
        if (skip.includes(key)) {
          return null;
        }

        if (key === 'removed') {
          return (
            <div className={styles.row} key={id}>
              {oldFundingSource?.team ? (
                <NewTeam team={oldFundingSource.team} colony={colony} />
              ) : (
                <FormattedMessage {...MSG.none} />
              )}
              <Icon name="arrow-right" className={styles.arrowIcon} />
              <span className={styles.right}>
                <FormattedMessage {...MSG.removed} />
              </span>
            </div>
          );
        }

        if (key === 'rates') {
          return (
            <ChangeRate
              rates={value as any}
              oldRates={oldFundingSource?.rates}
              colony={colony}
            />
          );
        }

        return (
          <ChangeItem
            newValue={value as ValueOf<ValuesType>}
            oldValue={oldFundingSource?.[key]}
            key={id}
            colony={colony}
            name={key}
          />
        );
      })}
      {!isEmpty(removedRates) &&
        removedRates?.map((removed) => (
          <div className={styles.row} key={removed.id}>
            <NewRate colony={colony} newValue={removed} />
            <Icon name="arrow-right" className={styles.arrowIcon} />
            <span className={styles.right}>
              <FormattedMessage {...MSG.removedRate} />
            </span>
          </div>
        ))}
    </>
  );
};

ChangedFundingSource.displayName = displayName;

export default ChangedFundingSource;
