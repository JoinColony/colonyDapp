/* @flow */

/**
 * pass in array of strings and shuffle them around
 */

/* eslint-disable-next-line import/prefer-default-export */
export const shuffle = (array: Array<string>) => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    // eslint-disable-next-line no-param-reassign
    array[currentIndex] = array[randomIndex];
    // eslint-disable-next-line no-param-reassign
    array[randomIndex] = temporaryValue;
  }
  return array;
};

/**
 * Sort an array of objects by multiple properties.
 */
type ValidSortByType = boolean | number | string;

type SortByPropertyConfig = {
  compareFn?: (prevVal: any, nextVal: any) => number,
  name: string,
  reverse?: boolean,
};

export const sortObjectsBy = (
  ...sortByPropertyNames: Array<string | SortByPropertyConfig>
): ((prev: Object, next: Object) => number) => {
  const defaultCompare = (
    valA: ValidSortByType,
    valB: ValidSortByType,
  ): number => {
    if (!!valA && valB === undefined) {
      return -1;
    }
    if (!!valB && valA === undefined) {
      return 1;
    }

    if (typeof valA !== typeof valB) {
      return 0;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      // eslint-disable-next-line no-param-reassign
      valA = valA.toLowerCase();
      // eslint-disable-next-line no-param-reassign
      valB = valB.toLowerCase();
    }

    if (valA === valB) {
      return 0;
    }

    if (typeof valA === 'boolean' && typeof valB === 'boolean') {
      if (valA || valB) {
        return valA ? -1 : 1;
      }
    }

    // $FlowFixMe: Flow is confused by mismatched types. Mismatched types will return 0 above.
    return valA < valB ? -1 : 1;
  };

  const sortByConfigs: Array<SortByPropertyConfig> = sortByPropertyNames.map(
    sortKey => {
      let sortItem = {};
      if (typeof sortKey === 'string') {
        sortItem.name = sortKey;
      } else {
        sortItem = { ...sortKey };
      }
      return sortItem;
    },
  );

  return (prev: Object, next: Object): number => {
    let result = 0;

    for (let i = 0; i < sortByConfigs.length; i += 1) {
      const {
        compareFn = defaultCompare,
        name,
        reverse = false,
      }: SortByPropertyConfig = sortByConfigs[i];

      const directionMultiplier = reverse ? -1 : 1;
      const prevVal = prev[name];
      const nextVal = next[name];

      result = compareFn(prevVal, nextVal) * directionMultiplier;
      if (result !== 0) {
        break;
      }
    }
    return result;
  };
};
