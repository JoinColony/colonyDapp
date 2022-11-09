import React, { Fragment } from 'react';

import { Rate } from '~dashboard/ExpenditurePage/Streaming/types';
import { Colony } from '~data/index';

import ChangeItem from '../../ChangeItem';

import { checkIfLimitIsChanged, checkIfRateIsChanged } from './utils';

const displayName = `dashboard.EditExpenditureDialog.ChangedStreaming.ChangedRate`;

interface Props {
  rates: Partial<Rate>[];
  oldRates?: Rate[];
  colony: Colony;
}

const ChangedRate = ({ rates, oldRates, colony }: Props) => {
  return (
    <>
      {rates.map((rateItem) => {
        const oldRate = oldRates?.find((oldItem) => oldItem.id === rateItem.id);
        // we have the whole rate object here, so we have to check
        // what has been changed - limit or amount
        const changeInLimit = checkIfLimitIsChanged(rateItem, oldRate);

        const changeInAmount = checkIfRateIsChanged(rateItem, oldRate);

        if (changeInAmount && changeInLimit) {
          // if both, limit and amount has been changed

          return (
            <Fragment key={rateItem.id}>
              <ChangeItem
                newValue={rateItem}
                oldValue={oldRate}
                key={rateItem.id}
                colony={colony}
                name="rates"
              />
              <ChangeItem
                newValue={{
                  value: rateItem.limit,
                  tokenAddress: rateItem.token,
                }}
                oldValue={
                  oldRate?.limit
                    ? { value: oldRate?.limit, tokenAddress: oldRate?.token }
                    : undefined
                }
                key={rateItem.id}
                colony={colony}
                name="limit"
              />
            </Fragment>
          );
        }

        if (changeInLimit) {
          // only limit has been changed

          // newValue and oldValue props, passed to ChangeItem component,
          // must be of the type - { value: string; tokenAddress: string }

          return (
            <ChangeItem
              newValue={{
                value: rateItem.limit || 0,
                tokenAddress: rateItem.token,
              }}
              oldValue={
                oldRate?.limit
                  ? { value: oldRate?.limit, tokenAddress: oldRate?.token }
                  : undefined
              }
              key={rateItem.id}
              colony={colony}
              name="limit"
            />
          );
        }

        if (changeInAmount) {
          return (
            <ChangeItem
              newValue={rateItem}
              oldValue={oldRate}
              key={rateItem.id}
              colony={colony}
              name="rates"
            />
          );
        }

        return null;
      })}
    </>
  );
};

ChangedRate.displayName = displayName;

export default ChangedRate;
