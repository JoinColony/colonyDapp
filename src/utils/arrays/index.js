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

/*  Immutably move one array item to another spot in the array.
 *  Doesn't alter the original array
 */
export const immutableMove = (
  arr: Array<any>,
  from: number,
  to: number,
): Array<any> =>
  arr.reduce((prev, current, idx, self) => {
    if (from === to) {
      prev.push(current);
    }
    if (idx === from) {
      return prev;
    }
    if (from < to) {
      prev.push(current);
    }
    if (idx === to) {
      prev.push(self[from]);
    }
    if (from > to) {
      prev.push(current);
    }
    return prev;
  }, []);

/**
 * Return a unique Array from the provided source Array
 * Possible cases:
 * - No selector: will transform the Array to a Set and return that converted back to an Array (cannot be used for Arrays of Objects)
 * - Function selector: will use the Function to map the source Array, then filter it to be unique (usefull for Arrays of Objects) - the provided
 *                      selector Function should flatten an Object's prop that can be used for filtering
 * - String selector: will assume that we are filtering an Array of Objects and will check if the provided string is prop of the first Array Object
 *
 * @method uniqueBy
 *
 * @param {Array} sourceArrayThe The array to filter to be contain only unique values
 * @param {None/Function/String} uniqueSelector The way to filter the array (check the description above), can be ommited
 *
 * @return {Array} A new filtered array
 */
export const uniqueBy = (
  sourceArray: Array<any>,
  uniqueSelector: any,
): Array<any> => {
  if (!sourceArray.length) {
    return [];
  }
  if (!uniqueSelector) {
    const uniqueValues = new Set(sourceArray);
    return [...uniqueValues];
  }
  if (typeof uniqueSelector === 'function') {
    const uniqueValues = [];
    sourceArray.map(uniqueSelector).filter((object, index, self) => {
      if (self.indexOf(object) === index) {
        uniqueValues.push(sourceArray[index]);
        return true;
      }
      return false;
    });
    return uniqueValues;
  }
  if (
    typeof uniqueSelector === 'string' &&
    Object.prototype.hasOwnProperty.call(sourceArray[0], uniqueSelector)
  ) {
    return sourceArray.filter(
      (object, index, self) =>
        self.findIndex(
          currentObject =>
            currentObject[uniqueSelector] === object[uniqueSelector],
        ) === index,
    );
  }
  return sourceArray;
};

/* Immutably replace value at idx in arr with val */

export const immutableReplaceAt = (
  arr: Array<any>,
  idx: number,
  val: any,
): Array<any> => [...arr.slice(0, idx), val, ...arr.slice(idx + 1)];
