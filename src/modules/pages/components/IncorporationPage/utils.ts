import { isEmpty, isEqual, merge, uniq } from 'lodash';
import { Protector } from './types';

const skip = ['id', 'removed', 'created', 'isChanged'];

const checkArray = (newArray, oldArray) => {
  const allKeys = uniq([
    ...newArray?.map((val) => val.key),
    ...oldArray?.map((val) => val.key),
  ]);

  const changes = allKeys
    .map((key) => {
      const newValueById = newArray?.find((val) => val.key === key);
      const oldValueById = oldArray?.find((val) => val.key === key);

      if (!newValueById && oldValueById) {
        // value has been removed, so we set removed field to true
        return { key, removed: true };
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

            if (!isEqual(currVal, oldValueById[currKey])) {
              return { ...acc, ...{ [currKey]: currVal } };
            }

            return acc;
          },
          {},
        );

        return isEmpty(change) ? undefined : { key, ...change };
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
  let newProtectors: Protector | undefined;

  if ('protectors' in confirmedValues) {
    const changedUsers = values.protectors?.filter((user) =>
      confirmedValues.protectors.find((confUser) => confUser.key === user.key),
    );

    const sameUsers = values.protectors?.filter((user) =>
      confirmedValues.protectors.every((confUser) => confUser.key !== user.key),
    );

    const newUsers = confirmedValues.protectors?.filter(
      (value) => value.created,
    );

    newProtectors = [
      ...sameUsers,
      ...changedUsers.map((user) => {
        const newValue = confirmedValues.protectors.find(
          (item) => item.key === user.key,
        );

        return {
          ...user,
          ...newValue,
          isChanged: true,
        };
      }),
      ...newUsers.map((user) => ({
        ...user,
        created: undefined,
        isChanged: true,
      })),
    ].filter((rec) => !rec.removed) as any;
  }

  const newValues = merge({}, values, confirmedValues);

  return {
    ...newValues,
    ...('mainContact' in confirmedValues && {
      mainContact: confirmedValues.mainContact,
    }),
    ...('protectors' in confirmedValues && {
      protectors: newProtectors,
    }),
  };
};
