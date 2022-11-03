import {
  isArray,
  isBoolean,
  isEmpty,
  isNumber,
  isPlainObject,
  isString,
} from 'lodash';

import { FundingSource, Rate } from '../Streaming/types';

export const flattenObject = (
  o: any,
  prefixParameter?: string,
  resultParameter?: any,
) => {
  const prefix = prefixParameter || '';
  const result = resultParameter || {};

  if (isString(o) || isNumber(o) || isBoolean(o)) {
    result[prefix] = o;
    return result;
  }

  if (isArray(o) || isPlainObject(o)) {
    Object.keys(o).forEach((key) => {
      let pref = prefix;
      if (isArray(o)) {
        pref += `[${key}]`;
      } else if (isEmpty(prefix)) {
        pref = key;
      } else if (key === 'id' || key === 'defaultMessage' || key === 'date') {
        pref = prefix;
      } else {
        pref = `${prefix}.${key}`;
      }

      flattenObject(o[key], pref, result);
    });
  }

  return result;
};

export const calcAvailableToClaim = (funds?: FundingSource[]) => {
  if (!funds) {
    return undefined;
  }

  // create an array with all available rates
  const rates = funds.map((fundItem) => fundItem.rates).flat();

  const calcAvailable = rates.reduce<Rate[]>((acc, curr) => {
    // variable isAvailableToClaim is a mock, it should be replaced with an actual value
    const isAvailableToClaim = true;

    if (isAvailableToClaim) {
      // check if token has already been added
      const isTokenAdded = acc.find(
        (rateItem) => rateItem.token === curr.token,
      );
      return isTokenAdded
        ? acc.map((accItem) =>
            accItem.token === curr.token
              ? {
                  ...accItem,
                  amount:
                    Number(accItem.amount || 0) + Number(curr.amount || 0),
                }
              : accItem,
          )
        : [...acc, curr];
    }
    return acc;
  }, []);

  return calcAvailable;
};
