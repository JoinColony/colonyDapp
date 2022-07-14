import { isEqual, uniq } from 'lodash';

export const findDifferences = (
  newValues: Record<string, any>,
  oldValues?: Record<string, any>,
) => {
  if (!oldValues) {
    return undefined;
  }

  const allKeys = uniq([...Object.keys(newValues), ...Object.keys(oldValues)]);

  const differentValues = allKeys.reduce((result, key) => {
    if (key === 'id') {
      return result;
    }

    const oldValue = oldValues[key];
    const newValue = newValues[key];

    if (Array.isArray(newValue)) {
      const allIds = uniq([
        ...newValue.map((val) => val.id),
        ...oldValue.map((val) => val.id),
      ]);
      const changes = allIds
        .map((id, index) => {
          const newValueById = newValue.find((val) => val.id === id);
          const oldValueById = oldValue.find((val) => val.id === id);

          if (!newValueById && oldValueById) {
            // value has been removed, so we set removed field to true
            return { id, removed: true };
          }

          if (newValueById && !oldValueById) {
            // value has been added, so we set created field to true
            return { ...newValueById, created: true };
          }

          // check each value in an object
          if (typeof newValueById === 'object') {
            const change = Object.entries(newValueById).reduce(
              (acc, [currKey, currVal]) => {
                const initialVal = oldValue[index][currKey];

                if (currKey === 'isExpanded' || currKey === 'id') {
                  return acc;
                }

                if (!isEqual(currVal, initialVal)) {
                  return { ...acc, ...{ [currKey]: currVal } };
                }

                return acc;
              },
              {},
            );

            return Object.keys(change).length > 0
              ? { id, ...change }
              : undefined;
          }

          if (!isEqual(newValueById, oldValueById)) {
            return newValueById;
          }

          return undefined;
        })
        .filter((change) => !!change);

      return changes.length > 0 ? { ...result, ...{ [key]: changes } } : result;
    }

    if (!isEqual(oldValue, newValue)) {
      return { ...result, [key]: newValue };
    }

    return result;
  }, {});

  return differentValues;
};
