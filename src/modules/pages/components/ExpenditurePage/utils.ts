import { isEqual, uniq, isEmpty, assign, isNil, merge } from 'lodash';
import { nanoid } from 'nanoid';

import { DelayTime } from './types';

interface Delay {
  amount?: string;
  time: string;
}

const isDelayType = (obj: any): obj is Delay => {
  return (
    Object.prototype.hasOwnProperty.call(obj, 'amount') &&
    Object.prototype.hasOwnProperty.call(obj, 'time')
  );
};

export const isDelayTimeType = (time?: string): time is DelayTime => {
  if (!time) {
    return false;
  }
  if (
    time === DelayTime.Hours ||
    time === DelayTime.Days ||
    time === DelayTime.Months
  ) {
    return true;
  }
  return false;
};

const timeMultiplier = (time: DelayTime) => {
  switch (time) {
    case DelayTime.Hours: {
      return 3600;
    }
    case DelayTime.Days: {
      return 86400;
    }
    case DelayTime.Months: {
      return 2629743.83;
    }
    default: {
      return 1;
    }
  }
};

export const getTimeDifference = ({
  amount,
  time,
}: {
  amount: string;
  time: DelayTime;
}): number => {
  const multiplicator = timeMultiplier(time);

  return Number(amount) * multiplicator;
};

export const setClaimDate = ({
  amount,
  time,
}: GetTimeDifferenceParameters): number | undefined => {
  if (!isDelayTimeType(time)) {
    return undefined;
  }

  const differenceInSeconds = getTimeDifference({ amount, time });
  const currentDate = new Date();
  return currentDate.setSeconds(currentDate.getSeconds() + differenceInSeconds);
};

const skip = [
  'id',
  'claimed',
  'isExpanded',
  'removed',
  'created',
  'isChanged',
  'claimDate',
  'expenditure',
];

const checkArray = (newArray, oldArray) => {
  const allIds = uniq([
    ...newArray?.map((val) => val.id),
    ...oldArray?.map((val) => val.id),
  ]);

  const changes = allIds
    .map((id) => {
      const newValueById = newArray?.find((val) => val.id === id);
      const oldValueById = oldArray?.find((val) => val.id === id);

      if (!newValueById && oldValueById) {
        // value has been removed, so we set removed field to true
        return { id, removed: true };
      }

      if (newValueById && !oldValueById) {
        // value has been added, so we set created field to true
        return { ...newValueById, created: true };
      }

      if (typeof newValueById === 'object') {
        const change = Object.entries(newValueById).reduce(
          (acc, [currKey, currVal]) => {
            // we don't want to check if 'isExpanded', 'id', etc. have been changed
            if (skip.includes(currKey)) {
              return acc;
            }

            // if delay amount hasn't been set
            if (currKey === 'delay' && isDelayType(currVal)) {
              if (
                isEmpty(currVal.amount) &&
                isEmpty(oldValueById[currKey].amount)
              ) {
                return acc;
              }
            }
            if (!isEqual(currVal, oldValueById[currKey])) {
              return { ...acc, ...{ [currKey]: currVal } };
            }

            return acc;
          },
          {},
        );

        return isEmpty(change) ? undefined : { id, ...change };
      }

      if (!isEqual(newValueById, oldValueById)) {
        return newValueById;
      }

      return undefined;
    })
    .filter((change) => !!change);

  return changes;
};

export const findDifferences = (
  newValues: Record<string, any>,
  oldValues?: Record<string, any>,
) => {
  if (!oldValues) {
    return undefined;
  }

  const allKeys = uniq([...Object.keys(newValues), ...Object.keys(oldValues)]);

  const differentValues = allKeys?.reduce((result, key) => {
    if (key === 'id') {
      return result;
    }

    const oldValue = oldValues[key];
    const newValue = newValues[key];

    if (Array.isArray(newValue)) {
      const changes = checkArray(newValue, oldValue);

      return changes.length > 0 ? { ...result, ...{ [key]: changes } } : result;
    }

    if (typeof newValue === 'object' && typeof oldValue === 'object') {
      const change = Object.entries(newValue).reduce(
        (acc, [currKey, currVal]) => {
          if (Array.isArray(currVal)) {
            const changes = checkArray(currVal, oldValue[currKey]);

            return { ...acc, ...(!isEmpty(changes) && { [currKey]: changes }) };
          }
          if (!isEqual(currVal, oldValue[currKey])) {
            return { ...acc, ...{ [currKey]: currVal } };
          }

          return acc;
        },
        {},
      );
      return { ...result, ...(!isEmpty(change) && { [key]: change }) };
    }

    if (!isEqual(oldValue, newValue)) {
      return { ...result, [key]: newValue };
    }

    return result;
  }, {});

  return differentValues;
};

export const updateValues = (values, confirmedValues) => {
  if ('recipients' in confirmedValues) {
    const changedRecipients = values.recipients.filter((recipient) =>
      confirmedValues.recipients.find((confRec) => confRec.id === recipient.id),
    );

    const sameRecipients = values.recipients.filter((recipient) =>
      confirmedValues.recipients.every(
        (confRec) => confRec.id !== recipient.id,
      ),
    );

    const newRecipients = confirmedValues.recipients.filter(
      (value) => value.created,
    );

    const newValues = {
      ...values,
      recipients: [
        ...sameRecipients,
        ...changedRecipients.map((recipient) => {
          const newValue = confirmedValues.recipients.find(
            (recip) => recip.id === recipient.id,
          );

          return {
            ...recipient,
            ...newValue,
            key: nanoid(),
            isChanged: true,
            ...(!isNil(newValue.delay?.amount) && {
              claimDate: setClaimDate({
                amount: newValue.delay.amount,
                time: newValue.delay.time,
              }),
            }),
          };
        }),
        ...newRecipients.map((newRecip) => ({
          ...newRecip,
          created: undefined,
          isChanged: true,
          key: nanoid(),
          claimDate: newRecip.delay.amount
            ? setClaimDate({
                amount: newRecip.delay.amount,
                time: newRecip.delay.time,
              })
            : new Date().getTime(),
        })),
      ].filter((rec) => !rec.removed),
    };

    const newConfirmed = Object.entries(confirmedValues).reduce(
      (acc, [key, value]) => {
        if (key !== 'recipients') {
          return {
            ...acc,
            ...{ [key]: value },
          };
        }
        return acc;
      },
      {},
    );

    return assign({}, newValues, newConfirmed);
  }

  if ('split' in confirmedValues) {
    const changedRecipients = values.split.recipients.filter((recipient) =>
      confirmedValues.split.recipients.find(
        (confRec) => confRec.id === recipient.id,
      ),
    );

    const sameRecipients = values.split.recipients.filter((recipient) =>
      confirmedValues.split.recipients.every(
        (confRec) => confRec.id !== recipient.id,
      ),
    );

    const newRecipients = confirmedValues.split.recipients.filter(
      (value) => value.created,
    );

    const confirmedRecipients = [
      ...sameRecipients,
      ...changedRecipients.map((recipient) => {
        const newValue = confirmedValues.split.recipients.find(
          (recip) => recip.id === recipient.id,
        );

        return {
          ...recipient,
          ...newValue,
          key: nanoid(),
          isChanged: true,
        };
      }),
      ...newRecipients.map((newRecip) => ({
        ...newRecip,
        created: undefined,
        isChanged: true,
        key: nanoid(),
      })),
    ].filter((rec) => !rec.removed);

    const newValues = merge({}, values, confirmedValues);

    return {
      ...newValues,
      split: { ...newValues.split, recipients: confirmedRecipients },
    };
  }

  return merge({}, values, confirmedValues);
};

type GetTimeDifferenceParameters = {
  amount: string;
  time: string;
};
