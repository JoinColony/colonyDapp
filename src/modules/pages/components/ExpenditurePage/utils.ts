import { isEqual, uniq, isEmpty, assign } from 'lodash';

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

                // we don't want to check if 'isExpanded' and 'id' have been changed
                if (currKey === 'isExpanded' || currKey === 'id') {
                  return acc;
                }

                // if delay amount hasn't been set
                if (currKey === 'delay' && isDelayType(currVal)) {
                  if (isEmpty(currVal.amount) && isEmpty(initialVal.amount)) {
                    return acc;
                  }
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

          return { ...recipient, ...newValue, isChanged: true };
        }),
        ...newRecipients.map((newRecip) => ({
          ...newRecip,
          created: undefined,
          isChanged: true,
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
    const here = assign({}, newValues, newConfirmed);

    return here;
  }
  return assign({}, values, confirmedValues);
};
