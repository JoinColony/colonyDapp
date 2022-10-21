import {
  isArray,
  isBoolean,
  isEmpty,
  isNumber,
  isPlainObject,
  isString,
} from 'lodash';

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
    Object.keys(o).map((key) => {
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
      return result;
    });
  }

  return result;
};
